#!/bin/bash
# Script para remover imports duplicados de Modal
# Executa: bash fix-modal-imports.sh

echo "🔧 Corrigindo imports duplicados de Modal..."

# Arquivos que precisam de correção
FILES=(
  "app/approvals/ApprovalsClient.js"
  "app/team/TeamClient.js"
  "app/users/UsersClient.js"
  "app/dashboard/DashboardClient.js"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processando: $file"
    
    # Remove a linha que importa Modal de @/components/Modal
    sed -i '/import Modal from "@\/components\/Modal"/d' "$file"
    sed -i "/import Modal from '@\/components\/Modal'/d" "$file"
    
    echo "✅ $file corrigido"
  fi
done

echo ""
echo "✨ Todos os arquivos foram corrigidos!"
echo ""
echo "Próximos passos:"
echo "1. Faça commit: git add . && git commit -m 'Corrigir imports duplicados do Modal'"
echo "2. Faça push: git push"
echo "3. Vercel fará novo build automaticamente"
