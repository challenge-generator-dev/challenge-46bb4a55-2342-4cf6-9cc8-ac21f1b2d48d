# Valores por defecto para la configuración de infraestructura
# Estos valores se aplican cuando no se especifica un archivo tfvars específico

environment         = "dev"
aws_region          = "us-east-1"
aws_assume_role_arn = ""

# Configuración de DynamoDB
dynamodb_table_name     = "orders"
dynamodb_billing_mode   = "PAY_PER_REQUEST"
dynamodb_read_capacity  = 5
dynamodb_write_capacity = 5
dynamodb_hash_key       = "order_id"
dynamodb_range_key      = ""
dynamodb_ttl_attribute  = "expiry_time"

# Atributos de la tabla DynamoDB
# Define los atributos que se utilizan como claves o índices
dynamodb_attributes = [
  {
    name        = "order_id"
    type        = "S"
    description = "Clave de partición principal - ID único de la orden"
  },
  {
    name        = "customer_id"
    type        = "S"
    description = "Identificador del cliente que realizó la orden"
  },
  {
    name        = "status"
    type        = "S"
    description = "Estado actual de la orden: pending, confirmed, shipped, delivered, cancelled"
  },
  {
    name        = "created_at"
    type        = "S"
    description = "Timestamp de creación de la orden en formato ISO 8601"
  },
  {
    name        = "updated_at"
    type        = "S"
    description = "Timestamp de última actualización de la orden"
  },
  {
    name        = "expiry_time"
    type        = "N"
    description = "Timestamp Unix para expiración automática de la orden"
  }
]

# Índices secundarios globales (GSI)
# Vacío por defecto - agregar según necesidades de consulta
dynamodb_global_secondary_indexes = []

# Tags aplicados a todos los recursos
dynamodb_tags = {
  Project            = "orders-management"
  ManagedBy          = "terraform"
  CostCenter         = "engineering"
  DataClassification = "internal"
}

# Configuración de IAM
iam_policy_name        = "dynamodb-orders-policy"
iam_role_name          = "dynamodb-orders-role"
iam_policy_description = "Política para acceso completo a la tabla DynamoDB de órdenes"