# Bytebank Mobile

Aplicativo de gerenciamento financeiro em React Native com Expo, desenvolvido
para o Tech Challenge da Fase 03 da Pós-Tech FIAP em Front-End Engineering.

O app permite que o usuário autenticado acompanhe seu saldo e suas análises
financeiras em um dashboard, e faça o cadastro, a edição, a consulta e a
remoção das próprias transações, com dados persistidos no Cloud Firestore.

## Funcionalidades

- Autenticação com e-mail e senha pelo Firebase Authentication, com sessão
  persistida entre aberturas do app
- Dashboard com saldo, gráfico de receitas e despesas dos últimos 6 meses,
  distribuição por tipo de transação e extrato resumido
- Animações de entrada com a API `Animated` do React Native
- Listagem de transações com scroll infinito, pull-to-refresh e paginação por
  cursor no Firestore
- Filtros por categoria e por período, e busca pelo início da descrição
- Cadastro e edição em formulário único, com validação de campos via Zod
- Remoção com diálogo de confirmação
- Anexo de recibos em PDF, JPG, PNG ou WEBP, com pré-visualização das imagens
  no formulário e na listagem (veja as limitações conhecidas)
- Estado global com Context API, tanto para autenticação quanto para transações

## Requisitos

- Node.js 20 ou superior
- npm
- Um projeto no [Firebase](https://console.firebase.google.com/)
- Para rodar no celular, o aplicativo [Expo Go](https://expo.dev/go)

## Instalação

```bash
npm install
```

## Configuração do Firebase

### 1. Crie o projeto e o app web

No [console do Firebase](https://console.firebase.google.com/), crie um projeto
e registre um app **Web** dentro dele. O Firebase vai exibir um objeto
`firebaseConfig` com sete chaves — são elas que o app precisa.

### 2. Ative a autenticação

Em **Authentication → Sign-in method**, habilite o provedor **E-mail/senha**.

### 3. Crie o banco de dados

Em **Firestore Database**, crie o banco. O app usa uma coleção raiz chamada
`transactions`, com um campo `userId` em cada documento.

### 4. Preencha as variáveis de ambiente

Copie o arquivo de exemplo e preencha com os valores do seu `firebaseConfig`:

```bash
cp .env.example .env
```

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

O `.env` está no `.gitignore` e não deve ser versionado. As variáveis são lidas
quando o Metro inicia, então depois de alterá-las é preciso reiniciar com
`npx expo start --clear`.

### 5. Publique as regras de segurança

Em **Firestore Database → Regras**, publique o conteúdo abaixo. Ele garante que
cada usuário só acessa as próprias transações:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isValidTransactionData() {
      let data = request.resource.data;
      return data.accountId is string
          && data.value is number
          && (data.type == 'Debit' || data.type == 'Credit')
          && data.from is string
          && data.to is string;
    }

    match /accounts/{accountId} {
      allow read: if isAuthenticated();

      match /transactions/{transactionId} {
        allow read: if isAuthenticated();
      }
    }

    match /transactions/{transactionId} {
      allow read: if isOwner(resource.data.userId);

      allow create: if isOwner(request.resource.data.userId)
                    && isValidTransactionData();

      allow update: if isOwner(resource.data.userId)
                    && request.resource.data.userId == resource.data.userId;

      allow delete: if isOwner(resource.data.userId);
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

A função `isValidTransactionData` vem do modelo de extrato usado pela versão
web do Bytebank. Para atendê-la sem alterar o modelo de domínio do app, a
camada de serviço grava os campos `accountId`, `value`, `type`, `from` e `to`
junto com os campos próprios do aplicativo.

### 6. Crie os índices compostos

As consultas combinam filtro por usuário, filtros opcionais e ordenação, o que
exige índices compostos na coleção `transactions`. Os principais são:

| Campos                                                       |
| ------------------------------------------------------------ |
| `userId` asc, `date` desc, `createdAt` desc, `__name__` desc |
| `userId` asc, `category` asc, `date` desc, `createdAt` desc, `__name__` desc |
| `userId` asc, `nameLowercase` asc, `date` desc, `createdAt` desc, `__name__` desc |

A forma mais simples de criá-los é usar o app: ao aplicar uma combinação de
filtros que ainda não tem índice, o Firestore retorna um erro contendo um link
que cria o índice já preenchido. Em desenvolvimento esse link é impresso no
console do Metro. Cada índice leva de um a alguns minutos para ficar pronto.

## Executando o projeto

```bash
npm start
```

Com o servidor no ar, escaneie o QR Code com o Expo Go ou use uma das teclas de
atalho mostradas no terminal. Também é possível iniciar direto em uma
plataforma:

```bash
npm run android
npm run ios
npm run web
```

### Outros scripts

```bash
npm run lint        # ESLint
npx tsc --noEmit    # verificação de tipos
```

## Estrutura do projeto

```
src/
├── app/                rotas do Expo Router (index, login, cadastro, home, transactions)
├── components/
│   ├── ui/             design system (Button, Input, Select, Modal, Chart, ...)
│   ├── Datepicker/     seletor de data, com implementação web e nativa
│   ├── TransactionFormModal/  formulário de cadastro e edição
│   ├── ReceiptsField/  anexos do formulário
│   ├── ReceiptViewerModal/  visualização dos recibos de uma transação
│   └── layout/         Header, Menu, Avatar
├── contexts/           AuthContext e TransactionsContext
├── services/
│   ├── firebase.ts     inicialização do SDK
│   ├── auth.ts         login, cadastro e logout
│   ├── transactions/   contrato e implementações (Firestore e mock)
│   └── receipts/       contrato, seleção de arquivo e implementações
├── shared/
│   ├── types/          modelo de domínio
│   ├── utils/          datas, arquivos, agregação do dashboard
│   └── validation/     schemas Zod
└── styles/             tokens de cor e variáveis
```

## Arquitetura

O acesso a dados fica atrás de contratos em TypeScript. O arquivo
`src/services/transactions/index.ts` escolhe qual implementação será usada, e
hoje aponta para o Firestore; trocar para o mock em memória é mudar uma linha.
O mesmo vale para os recibos, em `src/services/receipts/index.ts`.

O estado global vive em dois contextos, declarados em `src/app/_layout.tsx`. O
`AuthContext` é a fonte única da identidade do usuário e alimenta o
`TransactionsContext`, que concentra a lista, os filtros, o resumo do dashboard
e as operações de escrita. As telas não conversam diretamente com os serviços.

Algumas decisões que ajudam a ler o código:

- As datas são strings no formato `YYYY-MM-DD`, o que permite filtros de
  período e ordenação diretamente no Firestore, sem problemas de fuso horário
- O valor da transação é um número com sinal, negativo para saídas
- A paginação usa um cursor opaco com os valores de ordenação, e não o id
- A busca é por prefixo da descrição, apoiada em um campo `nameLowercase`
  gravado apenas no Firestore

## Limitações conhecidas

- **Recibos são gravados dentro do documento da transação, e não no Firebase
  Storage.** O bucket exige o plano Blaze, que não está habilitado no projeto,
  então o arquivo é convertido para base64 e salvo no próprio documento. Como o
  Firestore limita cada documento a 1 MiB, os recibos de uma mesma transação
  somam no máximo 700 KB — o que normalmente exclui fotos tiradas com a câmera.
  A troca para o Storage exige apenas uma nova implementação do contrato
  `ReceiptStorageService`
- **Pré-visualização apenas de imagens.** PDFs anexados são listados com nome e
  tamanho, mas não são exibidos, porque o React Native não renderiza PDF sem
  uma biblioteca dedicada
- **A busca encontra pelo início da descrição, não por trecho.** Buscar "sup"
  encontra "Supermercado", mas "mercado" não. É uma limitação do Firestore, que
  não oferece busca por conteúdo
- **O bloco `/accounts` das regras de segurança** continua liberado para
  qualquer usuário autenticado, por ser compartilhado com a versão web
- **O saldo e os gráficos consideram os últimos 6 meses**, que é a janela
  buscada para as análises
