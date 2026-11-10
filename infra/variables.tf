# Definición de variables de entrada para la configuración de Terraform
# Estas variables permiten parametrizar la infraestructura para diferentes entornos
# (dev, staging, prod) sin modificar el código.

# Variables globales
variable "environment" {
  description = "Entorno en el que se despliega la infraestructura (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "Región de AWS donde se desplegará la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "aws_assume_role_arn" {
  description = "ARN del rol de AWS a asumir para despliegues en entornos específicos"
  type        = string
  default     = ""
}

# Variables específicas para DynamoDB
variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para órdenes"
  type        = string
  default     = "orders"
}

variable "dynamodb_billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "dynamodb_read_capacity" {
  description = "Capacidad de lectura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "dynamodb_write_capacity" {
  description = "Capacidad de escritura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "dynamodb_hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string
  default     = "order_id"
}

variable "dynamodb_range_key" {
  description = "Clave de rango (sort key) para la tabla DynamoDB"
  type        = string
  default     = ""
}

variable "dynamodb_attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
  default = [
    {
      name = "order_id"
      type = "S"
    },
    {
      name = "client_id"
      type = "S"
    },
    {
      name = "order_date"
      type = "S"
    },
    {
      name = "status"
      type = "S"
    }
  ]
}

variable "dynamodb_global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla DynamoDB"
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = string
    projection_type = string
    read_capacity   = number
    write_capacity  = number
  }))
  default = [
    {
      name            = "client_id-index"
      hash_key        = "client_id"
      range_key       = "order_date"
      projection_type = "ALL"
      read_capacity   = 5
      write_capacity  = 5
    }
  ]
}

variable "dynamodb_ttl_attribute" {
  description = "Nombre del atributo para Time To Live (TTL) en DynamoDB"
  type        = string
  default     = "expiry_time"
}

variable "dynamodb_tags" {
  description = "Tags para la tabla DynamoDB"
  type        = map(string)
  default = {
    Name        = "orders-table"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}

# Variables para IAM
variable "iam_policy_name" {
  description = "Nombre de la política IAM para acceso a DynamoDB"
  type        = string
  default     = "dynamodb-orders-policy"
}

variable "iam_role_name" {
  description = "Nombre del rol IAM para acceso a DynamoDB"
  type        = string
  default     = "dynamodb-orders-role"
}

variable "iam_policy_description" {
  description = "Descripción de la política IAM"
  type        = string
  default     = "Política para acceso a la tabla DynamoDB de órdenes"
}

# Outputs globales
# Estos outputs exponen información crítica que puede ser utilizada por otros
# módulos o herramientas externas.