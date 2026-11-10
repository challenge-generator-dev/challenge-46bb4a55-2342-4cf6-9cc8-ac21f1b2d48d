# Infraestructura de Órdenes con Terraform

Este módulo de infraestructura define los recursos necesarios para persistir órdenes en DynamoDB y gestionar el acceso mediante políticas IAM.

## Recursos definidos

### DynamoDB
- Tabla `orders` con clave de partición `order_id`
- Modo de facturación PAY_PER_REQUEST
- TTL habilitado en atributo `expiry_time`
- Cifrado del lado del servidor con AWS managed key

### IAM
- Política para operaciones Get, Put, Update, Delete en la tabla
- Rol ejecutable por servicios que necesiten acceder a DynamoDB

## Uso del módulo

```hcl
module "orders_infra" {
  source = "./"

  environment           = "prod"
  aws_region            = "us-east-1"
  dynamodb_table_name   = "orders-prod"
  dynamodb_hash_key     = "order_id"
  dynamodb_attributes   = [...]
  dynamodb_tags         = { Environment = "prod" }
}
```

## Validación local

Ejecutar para verificar la configuración:

```bash
cd environments/dev
terraform init
terraform validate
terraform plan
```

## Estructura del módulo

```
infra/
├── environments/
│   └── dev/
│       └── terraform.tfvars    # Valores para entorno dev
├── modules/
│   ├── dynamodb/               # Módulo de tabla DynamoDB
│   └── iam/                    # Módulo de políticas y roles
├── providers.tf                # Configuración de providers
├── variables.tf                # Variables del módulo raíz
├── main.tf                     # Composición de recursos
├── outputs.tf                  # Outputs del módulo
└── terraform.tfvars            # Valores por defecto
```

## Outputs disponibles

- `environment` - Nombre del entorno desplegado
- `aws_region` - Región de AWS configurada
- `dynamodb_table_name` - Nombre de la tabla creada
- `dynamodb_table_arn` - ARN de la tabla (del módulo dynamodb)
- `iam_policy_arn` - ARN de la política de acceso

## Notas de diseño

- La tabla usa clave de partición simple (`order_id`) para optimizar consultas por ID
- El TTL en `expiry_time` permite limpieza automática de órdenes expiradas
- La política IAM sigue el principio de mínimo privilegio
- El estado de Terraform se versiona en S3 para entornos de producción