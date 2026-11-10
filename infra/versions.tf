terraform {
  required_version = ">= 1.7.0"

}

# Configuración del provider AWS
# El provider se configura en providers.tf con las variables de región y role de asunción
# Esta declaración de versión asegura compatibilidad con la sintaxis de Terraform 1.7+

# Backend para almacenamiento remoto del estado de Terraform
# Se utiliza S3 para mantener el estado de infraestructura versionado y compartido
terraform {
  backend "s3" {
    bucket         = "terraform-state-${var.environment}"
    key            = "infra/state.tfstate"
    region         = var.aws_region
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

# Notas sobre versionado de providers:
# - hashicorp/aws 5.40.0 es una versión estable release en 2024
# - Esta versión incluye soporte completo para todos los recursos de DynamoDB v2
# - El proveedor oficial de AWS es requerido para crear recursos en AWS