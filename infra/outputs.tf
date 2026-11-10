# Outputs de la infraestructura completa del sistema de órdenes
# Estos valores son consumidos por otros módulos o pipelines de CI/CD

# Información de la cuenta y región de AWS
output "aws_account_id" {
  description = "ID de la cuenta de AWS"
  value       = data.aws_caller_identity.current.account_id
}

output "aws_region" {
  description = "Región de AWS configurada"
  value       = var.aws_region
}

output "environment" {
  description = "Entorno de despliegue"
  value       = var.environment
}

# Outputs del módulo de DynamoDB
output "dynamodb_table_name" {
  description = "Nombre de la tabla de DynamoDB para órdenes"
  value       = module.dynamodb.table_name
}

output "dynamodb_table_arn" {
  description = "ARN de la tabla de DynamoDB"
  value       = module.dynamodb.table_arn
}

output "dynamodb_table_id" {
  description = "ID de la tabla de DynamoDB"
  value       = module.dynamodb.table_id
}

output "dynamodb_table_endpoint" {
  description = "Endpoint de la tabla de DynamoDB"
  value       = module.dynamodb.table_endpoint
}

output "dynamodb_table_stream_arn" {
  description = "ARN del stream de DynamoDB para captura de cambios"
  value       = module.dynamodb.table_stream_arn
}

output "dynamodb_hash_key_attribute_name" {
  description = "Nombre del atributo de clave hash"
  value       = module.dynamodb.hash_key_attribute_name
}

output "dynamodb_range_key_attribute_name" {
  description = "Nombre del atributo de clave de rango"
  value       = module.dynamodb.range_key_attribute_name
}

output "dynamodb_global_secondary_index_names" {
  description = "Nombres de los índices secundarios globales"
  value       = module.dynamodb.global_secondary_index_names
}

output "dynamodb_billing_mode" {
  description = "Modo de facturación de la tabla"
  value       = module.dynamodb.billing_mode
}

# Outputs del módulo de IAM
output "iam_role_name" {
  description = "Nombre del rol IAM para acceso a DynamoDB"
  value       = module.iam.role_name
}

output "iam_role_arn" {
  description = "ARN del rol IAM para acceso a DynamoDB"
  value       = module.iam.role_arn
}

output "iam_policy_arn" {
  description = "ARN de la política de acceso a DynamoDB"
  value       = module.iam.policy_arn
}

output "iam_cloudwatch_policy_arn" {
  description = "ARN de la política de CloudWatch Logs"
  value       = module.iam.cloudwatch_policy_arn
}

# Outputs de recursos adicionales
output "s3_app_logs_bucket_name" {
  description = "Nombre del bucket S3 para logs de la aplicación"
  value       = aws_s3_bucket.app_logs.id
}

output "s3_app_logs_bucket_arn" {
  description = "ARN del bucket S3 para logs de la aplicación"
  value       = aws_s3_bucket.app_logs.arn
}

output "sns_orders_notifications_topic_arn" {
  description = "ARN del topic SNS para notificaciones de pedidos"
  value       = aws_sns_topic.orders_notifications.arn
}

output "sns_orders_notifications_topic_name" {
  description = "Nombre del topic SNS para notificaciones de pedidos"
  value       = aws_sns_topic.orders_notifications.name
}

output "terraform_state_bucket_name" {
  description = "Nombre del bucket S3 para estado de Terraform"
  value       = aws_s3_bucket.terraform_state.id
}

output "terraform_state_bucket_arn" {
  description = "ARN del bucket S3 para estado de Terraform"
  value       = aws_s3_bucket.terraform_state.arn
}

output "terraform_locks_table_name" {
  description = "Nombre de la tabla DynamoDB para bloqueos de Terraform"
  value       = aws_dynamodb_table.terraform_locks.name
}

output "terraform_locks_table_arn" {
  description = "ARN de la tabla DynamoDB para bloqueos de Terraform"
  value       = aws_dynamodb_table.terraform_locks.arn
}

# Resumen de configuración completa para consumo externo
output "infrastructure_summary" {
  description = "Resumen de la infraestructura creada"
  value = {
    environment    = var.environment
    aws_region     = var.aws_region
    aws_account_id = data.aws_caller_identity.current.account_id
    dynamodb_table = module.dynamodb.table_name
    dynamodb_arn   = module.dynamodb.table_arn
    iam_role       = module.iam.role_name
    iam_policy     = module.iam.policy_arn
    logs_bucket    = aws_s3_bucket.app_logs.id
    sns_topic      = aws_sns_topic.orders_notifications.name
    state_bucket   = aws_s3_bucket.terraform_state.id
    locks_table    = aws_dynamodb_table.terraform_locks.name
  }
}