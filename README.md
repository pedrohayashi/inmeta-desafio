# Work Orders App - inMeta Technical

Este projeto é uma aplicação React Native com foco em **ordens de serviço offline-first**, permitindo criar, visualizar, sincronizar e editar ordens mesmo sem conexão com a internet.

## Funcionalidades Principais

- **Listagem de Ordens de Serviço**  
  Visualização de ordens com título, descrição, status e técnico responsável.

- **Criação e Edição de Ordens**  
  Modal (`WorkOrderModal`) para criar uma nova ordem ou editar uma existente.

- **Sincronização com o Servidor**  
  - Manual: Botão de sincronizar envia ordens pendentes e busca novas do servidor.
  - Automática: A sincronização ocorre automaticamente quando o app detecta que voltou a ter internet.

- **Detecção de Conectividade**  
  Usa `@react-native-community/netinfo` para exibir ícone de status da conexão.

- **Indicador de Pendência**  
  Ordens criadas localmente e ainda não sincronizadas são marcadas com um ícone de relógio.

## Principais Tecnologias Utilizadas

- **React Native**
- **Zustand** (para gerenciamento de estado)
- **Realm** (persistência local de dados)

## Estrutura Relevante

- `index.tsx`: Tela principal com listagem, criação e sincronização de ordens.
- `components/WorkOrderModal`: Modal de criação/edição de ordens.
- `hooks/useSync`: Lógica de sincronização com o servidor.
- `store/useStore`: Zustand store com os estados e ações para carregar ordens e filas pendentes.
