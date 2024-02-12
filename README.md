# metrics-dashboard

Esse foi o resultado de um desafio para implementar gráficos de métricas chaves de negócio para a empresa **Copybase**. As métricas que utilizei foram Churn Rate, MRR (Monthly Recurring Revenue) e LTV (Lifetime Value). A planilha usada para teste pode ser encontrada aqui: https://github.com/MatheusT45/metrics-dashboard/blob/main/assets/modelo-teste-full-stack.xlsx

Utilizei Typescript no projeto todo, Nestjs no backend e Vue3 (Vuetify) no frontend.

Realizei testes unitários para as duas aplicações.

Utilizei também o Docker para o ambiente local de desenvolvimento.

Também subi as aplicações utilizando serviços de CI/CD (vercel e railway). As aplicações estão disponíveis nos seguintes links:

FrontEnd: https://metrics-dashboard-one.vercel.app/

BackEnd: https://metrics-dashboard-production.up.railway.app

## Rodando localmente

É possível rodar o projeto localmente utilizando Docker, para isso, rode o seguinte comando:

```
docker compose up -d
```
As dependências serão instaladas no momento de build dos containers.

A API será hosteada em `http://localhost:3000/` e o frontend em `http://localhost:8000/`.

Rodando testes localmente:

Para rodar os testes no Backend:
```
docker exec -it server npm run test:cov
```

Para rodar os testes no Frontend:
```
docker exec -it web npm run coverage
```

## Documentação da API

Existem 3 endpoints na API:

```typescript
POST /churn-rate

Response Type: {
  data: {
    relatesTo: string;
    lostSubscriptions: number;
    subscriptions: number;
    newSubscriptions: number;
    churnRate: number;
  }[];
    total: {
    relatesTo: string;
    lostSubscriptions: number;
    subscriptions: number;
    newSubscriptions: number;
    churnRate: number;
  };
};
```

```typescript
POST /lifetime-value

Response Type: {
  data: {
    relatesTo: string;
    averageTicketValue: number;
    averageRetentionTime: number;
    lifetimeValue: number;
  }[];
  total: {
    relatesTo: string;
    averageTicketValue: number;
    averageRetentionTime: number;
    lifetimeValue: number;
  };
};
```

```typescript
POST /recurring-revenue

Response Type: {
  data: {
    relatesTo: string;
    revenue: number;
  }[];
  total: {
    relatesTo: string;
    revenue: number;
  };
};
```

Os três endpoints recebem o mesmo corpo na requisição para enviar arquivos e filtrar o resultado:
```typescript
{
  file?: SEU_ARQUIVO_AQUI
  options: {
    month?: number // Número do mês para realizar o filtro (ex.: entre 1 e 12)
    year?: number // Ano para realizar o filtro (ex.: 2022)
    filterSubscriptionPlan?: 'All' | 'Monthly' | 'Yearly' // Filtro de modalidade de inscrição (Mensal, Anual ou todas)
  };
}
```

Caso o arquivo não seja enviado, é utilizada uma cópia do csv provido no desafio para realizar o cálculo das métricas.

Há um arquivo documentando as requisições para a API em formato json exportado do postman, pode ser encontrado aqui: https://github.com/MatheusT45/metrics-dashboard/blob/main/assets/MetricsDashboard.postman_collection.json

## Sobre os dados
Identifiquei alguns erros na planilha e vou utilizar essa seção também para documentar minhas tomadas de decisão sobre a tratativa dos dados para justificar alguns trechos de código que escrevi para corrigí-los.

- Notei que as datas de `próximo ciclo`, `data de status` estavam inconsistentes e em formatos errados também ( as vezes `dd/mm/yyyy` outras `mm/dd/yyyy`)

O que eu fiz para corrigir:
- Para os usuários com assinatura mensal: Tratei a `data início` como um dado verdadeiro, a partir desse dado multipliquei pela `quantidade de cobranças` para descobrir a data certa de `próximo ciclo`, `data de status`.

Mapeamento dos campos:
- chargeAmount: Quantidade de vezes que o usuário foi cobrado
- chargeFrequencyInDays: Modalidade do plano de assinatura do usuario: mensal(30) e anual(365 ou 360)
- startDate: Data em que o usuário se inscreveu
- status:
  - Active - Ativo na plataforma ate o momento (statusDate)
  - Canceled - Perdeu acesso a plataforma, mas não recebeu o dinheiro de volta
  - Late - Atrasou o pagamento
  - Trial Canceled - Arrependimento, foi reembolsado
  - Upgrade - Fez um Upgrade do plano
- statusDate: Última data de atualização do status dessa assinatura
- cancellationDate: Data de cancelamento da assinatura
- valueCharged: Valor da assinatura
- nextCycle: Data final do período de utilização
- userId: id do usuário

## Pontos futuros

- Criar uma tela em que o usuário consiga enviar uma planilha com qualquer estrutura e que seja possível mapear os campos necessários para realizar os cálculos por essa tela. Assim esse projeto interpretaria qualquer estrutura de tabela para gerar os gráficos.



## Considerações finais

Gostaria de agradecer a oportunidade de fazer esse desafio, aprendi muito durante a criação dele.
