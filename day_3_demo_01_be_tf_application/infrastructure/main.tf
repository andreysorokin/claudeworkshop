# Infrastructure requirements (describe to Claude and ask it to generate the resources below):
#
#  - Azure Resource Group in uksouth
#  - Linux App Service Plan (B1 SKU)
#  - .NET 8 Web App wired to the plan
#  - Azure SQL Server + Basic-tier database
#  - App setting: ASPNETCORE_ENVIRONMENT = Staging
#  - Output the API hostname and SQL server FQDN

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}
