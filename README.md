
# Classificador Inteligente de Similaridade Semântica para o Setor Imobiliário

O projeto tem como objetivo classificar automaticamente mensagens enviadas por clientes de uma imobiliária, identificando o tema para enviar ao setor responsável (documentação, dúvidas, interesse, reclamação ou sugestão).

A solução utiliza busca semântica baseada em embeddings, permitindo entender o significado da frase mesmo que as palavras não sejam exatamente iguais às usadas no banco de dados, isso otimiza o atendimento, reduz o tempo de resposta e facilita o encaminhamento correto das solicitações.


## Tecnologias Utilizadas
🔹 OpenAI

Para geração de embeddings (vetores numéricos que representam o significado das frases).

\
🔹 Supabase (Postgres + pgvector)
* Armazenamento das frases de exemplo.

* Coluna vetorial vector(1536) para busca semântica.

* Função para retornar resultados por similaridade.

🔹 n8n (Automação)
* Orquestra toda a pipeline:

* Recebe mensagem pelo Webhook.

* Gera embedding da mensagem.

* Faz busca no banco vetorial (RPC Supabase).

* Aplica threshold de similaridade.

* Retorna a categoria encontrada.

\
🔹 Interface (Lovable/Bubble/etc.)

* Tela simples onde o usuário envia a mensagem.

* A aplicação consome o Webhook do n8n e exibe o setor classificado.
## 🎬 Link do Vídeo do Projeto
https://youtu.be/cV4V33-oE_c
## Como executar
#### 1. Criar o banco vetorial no Supabase
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE classificacoes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria text NOT NULL,
  texto text NOT NULL,
  embedding vector(1536)
);
```
#### 2. Criar função RPC de busca semântica

```sql
CREATE OR REPLACE FUNCTION match_classificacoes(
  query_embedding vector(1536),
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  categoria text,
  texto text,
  similarity float
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.categoria,
    c.texto,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM classificacoes c
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```
#### 3. Inserir dataset (frases + categorias)

#### 4. Configurar os fluxos no n8n
É só importar o arquivo Json e colocar as próprias chaves API e link da da função criada no Supabase

#### O primeiro fluxo 
* Webhook → recebe mensagem
* HTTP Request → envia a frase para OpenAI gerar embedding
* Supabase RPC → busca semântica
* Code Node → aplica threshold e formata retorno
* Respond to Webhook → devolve categoria para o front-end

#### O Segundo fluxo (Iniciar ele primeiro, pra gerar os vetores das frases inseridas no banco de dados)
* Receber novos exemplos de frases já categorizadas pelo administrador.
* Gerar embeddings usando a API da OpenAI.
* Armazenar esses vetores no Supabase, junto da categoria.
* Atualizar índices.
* Deixar os dados prontos para uso pela função RPC match_classificacoes

#### 5. Conectar a uma interface
* Conectar interface (Pode ser Lovable/Bubble/etc.)
* Criar formulário com campo mensagem.
* Fazer POST para o Webhook do n8n.
* Exibir categoria e confiança no front-end.
PS: Caso não queira usar uma interface, da pra fazer uma gambiarra com o site Reqbin pra testar

## 🖼 Prints do funcionamento
<img width="502" height="646" alt="image" src="https://github.com/user-attachments/assets/a0fbe43b-f716-4709-ba25-bfb57e33df26" />

<img width="538" height="648" alt="image" src="https://github.com/user-attachments/assets/38ed86d5-f602-4529-be01-ee5d0ee17249" />

<img width="975" height="495" alt="image" src="https://github.com/user-attachments/assets/8e137b75-df98-4e5e-8387-67d1d7649265" />

<img width="975" height="200" alt="image" src="https://github.com/user-attachments/assets/408fcd03-1e20-4a69-9b29-a0f4a4448ac6" />

<img width="975" height="247" alt="image" src="https://github.com/user-attachments/assets/71f505aa-e588-4a10-a032-0c31570983c7" />

<img width="538" height="709" alt="image" src="https://github.com/user-attachments/assets/f459e9ee-b90c-4031-aa10-af598662d9d7" />

