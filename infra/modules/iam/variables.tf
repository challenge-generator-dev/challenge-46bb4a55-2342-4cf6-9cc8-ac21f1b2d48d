# Variables de entrada para el módulo IAM
# Este archivo define las variables necesarias para crear políticas y roles IAM
# que permiten el acceso a la tabla DynamoDB y otros recursos.

variable "iam_policy_name" {
  description = "Nombre de la política IAM para acceso a DynamoDB"
  type        = string
  default     = "dynamodb-orders-policy"
}

variable "iam_policy_description" {
  description = "Descripción de la política IAM para acceso a DynamoDB"
  type        = string
  default     = "Política para acceso a la tabla DynamoDB de órdenes"
}

variable "table_arn" {
  description = "ARN de la tabla DynamoDB a la que se otorgará acceso"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags para los recursos IAM creados"
  type        = map(string)
  default     = {}
}

variable "iam_role_name" {
  description = "Nombre del rol IAM que utilizará la aplicación para acceder a DynamoDB"
  type        = string
  default     = "dynamodb-orders-role"
}

# Variables adicionales que main.tf intentaba pasar pero faltaban en el módulo
# Estas variables permiten una configuración más flexible del módulo IAM

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "region" {
  description = "Región de AWS donde se crearán los recursos"
  type        = string
  default     = "us-east-1"
}

# Variables alias para compatibilidad con main.tf que usa nombres sin prefijo
# El módulo puede recibir tanto policy_name como iam_policy_name

variable "policy_name" {
  description = "Nombre de la política IAM (alias para iam_policy_name)"
  type        = string
  default     = "dynamodb-orders-policy"
}

variable "role_name" {
  description = "Nombre del rol IAM (alias para iam_role_name)"
  type        = string
  default     = "dynamodb-orders-role"
}

variable "policy_description" {
  description = "Descripción de la política IAM (alias para iam_policy_description)"
  type        = string
  default     = "Política para acceso a la tabla DynamoDB de órdenes"
}