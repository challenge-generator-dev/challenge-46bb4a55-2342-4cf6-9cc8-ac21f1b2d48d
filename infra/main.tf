# Archivo principal de Terraform para la infraestructura del sistema de órdenes
# Este módulo orquesta la creación de todos los recursos de infraestructura
# necesarios para el sistema de gestión de órdenes con persistencia en DynamoDB

# Módulo de DynamoDB para almacenar las órdenes del sistema
# Se parametrizan todos los atributos de la tabla según las variables definidas
module "dynamodb" {
  source = "./modules/dynamodb"

  table_name               = var.dynamodb_table_name
  billing_mode             = var.dynamodb_billing_mode
  read_capacity            = var.dynamodb_read_capacity
  write_capacity           = var.dynamodb_write_capacity
  hash_key                 = var.dynamodb_hash_key
  range_key                = var.dynamodb_range_key
  attributes               = var.dynamodb_attributes
  global_secondary_indexes = var.dynamodb_global_secondary_indexes
  ttl_attribute            = var.dynamodb_ttl_attribute
  tags                     = var.dynamodb_tags

  # Habilitar streams para capturar cambios en la tabla
  # Útil para event-driven architecture y auditoría
  enable_stream    = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  # Cifrado del lado del servidor con KMS
  server_side_encryption_enabled = true
}

# Módulo de IAM para crear políticas y roles de acceso a DynamoDB
# El rol creado será utilizado por las aplicaciones que accedan a las órdenes
module "iam" {
  source = "./modules/iam"

  # El módulo IAM espera table_arn, no table_name
  # Se obtiene el ARN del módulo de DynamoDB
  table_arn = module.dynamodb.table_arn

  # Variables que el módulo IAM realmente acepta
  # policy_name y role_name sin prefijo iam_ ya que el módulo las define así
  policy_name        = var.iam_policy_name
  role_name          = var.iam_role_name
  policy_description = var.iam_policy_description

  # Tags para los recursos IAM
  tags = var.dynamodb_tags
}

# Recurso adicional: Bucket S3 para logs de la aplicación
# Almacena logs de acceso y aplicación para auditoría y debugging
resource "aws_s3_bucket" "app_logs" {
  bucket = "app-logs-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(var.dynamodb_tags, {
    Name        = "app-logs-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  })
}

# Configuración de lifecycle para el bucket de logs
resource "aws_s3_bucket_versioning" "app_logs" {
  bucket = aws_s3_bucket.app_logs.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Bloqueo público del bucket de logs por seguridad
resource "aws_s3_bucket_public_access_block" "app_logs" {
  bucket = aws_s3_bucket.app_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Recurso adicional: Topic SNS para notificaciones de pedidos
# Utilizado para enviar alertas cuando se crean, actualizan o eliminan pedidos
resource "aws_sns_topic" "orders_notifications" {
  name = "orders-notifications-${var.environment}"

  tags = merge(var.dynamodb_tags, {
    Name        = "orders-notifications"
    Environment = var.environment
  })
}

# Política de acceso al topic SNS
resource "aws_sns_topic_policy" "orders_notifications" {
  arn = aws_sns_topic.orders_notifications.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.orders_notifications.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_s3_bucket.app_logs.arn
          }
        }
      }
    ]
  })
}

# Bucket S3 para almacenar el estado de Terraform de forma remota
# Este bucket es crítico para el workflow de Terraform
resource "aws_s3_bucket" "terraform_state" {
  bucket = "terraform-state-${var.environment}"

  tags = merge(var.dynamodb_tags, {
    Name        = "terraform-state"
    Environment = var.environment
  })
}

# Versioning del estado de Terraform para mantener historial
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Bloqueo público del bucket de estado
resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Tabla DynamoDB para bloqueos de estado de Terraform
# Previene cambios concurrentes al estado
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name        = "terraform-locks"
    Environment = var.environment
  }
}

# Data source para obtener información de la cuenta actual
# Utilizada para construir ARNs y nombres de recursos
data "aws_caller_identity" "current" {}

# Data source para obtener la región actual
data "aws_region" "current" {}