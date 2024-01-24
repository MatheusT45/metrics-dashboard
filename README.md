# metrics-dashboard

FrontEnd: https://metrics-dashboard-one.vercel.app/

BackEnd: https://metrics-dashboard-production.up.railway.app

## Rodando localmente

You can run the project locally using docker

```
docker compose up
```

The API will be served on `http://localhost:3000/` and the frontend will be served on `http://localhost:8000/`

Erros identificados na planiilha:

Datas de pr'oximo ciclo, inconsistentes

pontos futuros:

- apontar cada campo do documento para mapear tipos diferentes de planilhas

## Sheet interpretations

mrr quando for um plano anual, conta como uma bolada mesmo

churn por tipo de plano

interpreta'c~ao dos campos:

- chargeAmount: quantidade de vezes que cobramos o usu'ario
- chargeFrequencyInDays: modalidade do plano de assinatura do usuario: mensal(30) e anual(365 ou 360)
- startDate: Data em que o usu'ario se inscreveu
- status:
  - Active - Ativo na plataforma ate o momento (statusDate)
  - Canceled - Perdeu acesso a plataforma, mas nao recebeu o dinheiro de volta
  - Late - Atrasou o pagamento
  - Trial Canceled - Arrependimento, foi reembolsado
  - Upgrade - Fez um Upgrade do plano
- statusDate: ultima data de atualizacao do status dessa assinatura
- cancellationDate: data de cancelamento da assinatura
- valueCharged: valor da assinatura
- nextCycle: data final do per'iodo de utiliza'c~ao
- userId: id do usu'ario

campo `pr'oximo ciclo` com data inconsistente

churn e receita por tipo de plano

SE A PESSOA ATIVOU O PLANO ATUAL, ELA CONSTA COMO ATIVA PARA OS PR'OXIMOS MESES (talvez precise checar o statusDate (?))
