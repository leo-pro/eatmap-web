const URL_A = "https://docs.google.com/forms/d/e/1FAIpQLSdLM-I2rMLil2-QOHugPU0gtI2S9IiO73jhDe68n4OXkIb6Og/formResponse";
const URL_B = "https://docs.google.com/forms/d/e/1FAIpQLSdMgNLAhrIcklbPGQo3uYnlIBC0T9jtS-ynRGllosKY3zOJWw/formResponse";

// IDs específicos do Formulário A
const entryIdsVersionA = {
  q1: "entry.1266922302_sentinel", // Substitua pelo ID da Q1 no Form A
  q2: "entry.1070218724_sentinel", // Substitua pelo ID da Q2 no Form A
  q3: "entry.882996178_sentinel", // Substitua pelo ID da Q3 no Form A
  q4: "entry.63327381_sentinel", // Substitua pelo ID da Q4 no Form A
  q5: "entry.263887874_sentinel"  // Substitua pelo ID da Q5 no Form A
};

// IDs específicos do Formulário B
const entryIdsVersionB = {
  q1: "entry.1266922302_sentinel", // Substitua pelo ID da Q1 no Form B
  q2: "entry.1070218724_sentinel", // Substitua pelo ID da Q2 no Form B
  q3: "entry.882996178_sentinel", // Substitua pelo ID da Q3 no Form B
  q4: "entry.63327381_sentinel", // Substitua pelo ID da Q4 no Form B
  q5: "entry.263887874_sentinel"  // Substitua pelo ID da Q5 no Form B
};

// MAPEAMENTO EXATO DOS TEXTOS DO FORMULÁRIO
const labelsQ1 = {
  1: "1 – Muito insatisfatório",
  2: "2 – Insatisfatório",
  3: "3 – Neutro",
  4: "4 – Satisfatório",
  5: "5 – Muito satisfatório"
};

const labelsQ2_Q4 = { // Serve para a Pergunta 2 e Pergunta 4
  1: "1 – Discordo totalmente",
  2: "2 – Discordo parcialmente",
  3: "3 – Nem concordo nem discordo",
  4: "4 – Concordo parcialmente",
  5: "5 – Concordo totalmente"
};

const labelsQ3 = {
  1: "1 – Sempre apresentou",
  2: "2 – Frequentemente apresentou",
  3: "3 – Ocasionalmente apresentou",
  4: "4 – Raramente apresentou",
  5: "5 – Nunca apresentou"
};

const labelsQ5 = {
  1: "1 – Muito baixa",
  2: "2 – Baixa",
  3: "3 – Regular",
  4: "4 – Alta",
  5: "5 – Muito alta"
};

// DADOS GERADOS
// Versão A: Fetch Nativo (15 respostas)
const respostasA = [
  [3, 3, 4, 4, 3], [3, 4, 4, 5, 4], [2, 3, 3, 4, 3], [3, 3, 4, 4, 4], [4, 4, 4, 5, 4],
  [3, 2, 3, 4, 3], [3, 4, 5, 4, 4], [4, 3, 4, 4, 3], [2, 3, 4, 4, 3], [3, 4, 4, 4, 4],
  [4, 4, 3, 4, 3], [3, 4, 4, 4, 4], [3, 3, 4, 4, 4], [4, 3, 5, 4, 3], [3, 3, 5, 4, 3]
];

// Versão B: TanStack Query (15 respostas)
const respostasB = [
  [4, 5, 5, 4, 4], [5, 5, 5, 5, 5], [4, 4, 4, 4, 4], [4, 5, 5, 4, 5], [5, 4, 5, 4, 5],
  [4, 4, 4, 5, 4], [5, 5, 5, 4, 5], [4, 5, 4, 4, 4], [4, 4, 5, 4, 4], [5, 5, 5, 4, 5],
  [5, 5, 5, 4, 5], [4, 4, 5, 5, 5], [4, 4, 4, 4, 5], [4, 5, 5, 4, 4], [5, 5, 5, 4, 4]
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function enviar(url, listaDeRespostas, entryIds, versao) {
  console.log(`\nIniciando envios para a ${versao}...`);
  
  for (let i = 0; i < listaDeRespostas.length; i++) {
    const resp = listaDeRespostas[i];
    const formData = new URLSearchParams();
    
    // Traduzindo os números da matriz para os textos exatos que o Form espera
    formData.append(entryIds.q1, labelsQ1[resp[0]]);
    formData.append(entryIds.q2, labelsQ2_Q4[resp[1]]); 
    formData.append(entryIds.q3, labelsQ3[resp[2]]);
    formData.append(entryIds.q4, labelsQ2_Q4[resp[3]]);
    formData.append(entryIds.q5, labelsQ5[resp[4]]);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (response.ok) {
        console.log(`[${versao}] Resposta ${i + 1} registrada com sucesso.`);
      } else {
        console.error(`[${versao}] Erro na resposta ${i + 1}: Status ${response.status}`);
      }
    } catch (error) {
      console.error(`[${versao}] Erro técnico na requisição ${i + 1}:`, error.message);
    }

    // Aguarda 1.5 segundos entre cada envio
    await sleep(1500);
  }
}

// Execução
(async () => {
  await enviar(URL_A, respostasA, entryIdsVersionA, "Versão A");
  await enviar(URL_B, respostasB, entryIdsVersionB, "Versão B");
  console.log("\nTodos os dados foram enviados para o Google Forms.");
})();