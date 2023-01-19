(function() {
  let inputArea = document.getElementById("text-area");
  let text = `O ZordWay App destaca o tamanho, complexidade de sentenças e erros comuns; se você se deparar com uma sentença amarela, a encurte ou a divida. Se você dar de cara com uma sentença destacada em vermellho, sua sentença é considerada difícil e complicada e os seus leitores irão se perder tentando seguir sua lógica sinuosa e dividida - tente editar essa sentença para remover o destaque em vermelho.
  Você pode utilizar o destaque em roxo como guia para encurtar ou usar palavras fáceis ao invés da palavra incialmente escrita.
  Advérbios e frases que enfraquecem seu texto são magicamente mostradas em azul. Remova elas ou escolha palavras fortes.`;
  inputArea.value = text;

  let data = {
    paragraphs: 0,
    sentences: 0,
    words: 0,
    hardSentences: 0,
    veryHardSentences: 0,
    adverbs: 0,
    complex: 0
  };

  function format() {
    data = {
      paragraphs: 0,
      sentences: 0,
      words: 0,
      hardSentences: 0,
      veryHardSentences: 0,
      adverbs: 0,
      complex: 0
    };
    ("use strict");
    let inputArea = document.getElementById("text-area");
    let text = inputArea.value;
    let paragraphs = text.split("\n");
    let outputArea = document.getElementById("output");
    let hardSentences = paragraphs.map(p => getDifficultSentences(p));
    let inP = hardSentences.map(para => `<p>${para}</p>`);
    data.paragraphs = paragraphs.length;
    console.log(data);
    counters();
    outputArea.innerHTML = inP.join(" ");
  }
  window.format = format;
  format();

  function counters() {
    document.querySelector("#adverb").innerHTML = `Você usou ${
      data.adverbs
    } advérbio${data.adverbs > 1 ? "s" : ""}. Tente usar ${Math.round(
      data.paragraphs / 3
    )} ou menos`;
    document.querySelector("#complex").innerHTML = `${data.complex} frase${
      data.complex > 1 ? "s" : ""
    } pode ser simplificada.`;
    document.querySelector("#hardSentence").innerHTML = `${
      data.hardSentences
    } das ${data.sentences} sentença${
      data.sentences > 1 ? "s são" : " "
    } difíceis de ler`;
    document.querySelector("#veryHardSentence").innerHTML = `${
      data.veryHardSentences
    } das ${data.sentences} sentença${
      data.sentences > 1 ? "s são" : " "
    } muito difíceis de ler`;
  }

  function getDifficultSentences(p) {
    let sentences = getSentenceFromParagraph(p + " ");
    data.sentences += sentences.length;
    let hardOrNot = sentences.map(sent => {
      let cleanSentence = sent.replace(/[^a-z0-9. ]/gi, "") + ".";
      let words = cleanSentence.split(" ").length;
      let letters = cleanSentence.split(" ").join("").length;
      data.words += words;
      sent = getAdverbs(sent);
      sent = getComplex(sent);
      sent = getQualifier(sent);
      let level = calculateLevel(letters, words, 1);
      if (words < 14) {
        return sent;
      } else if (level >= 10 && level < 14) {
        data.hardSentences += 1;
        return `<span class="hardSentence">${sent}</span>`;
      } else if (level >= 14) {
        data.veryHardSentences += 1;
        return `<span class="veryHardSentence">${sent}</span>`;
      } else {
        return sent;
      }
    });

    return hardOrNot.join(" ");
  }

  function getSentenceFromParagraph(p) {
    let sentences = p
      .split(". ")
      .filter(s => s.length > 0)
      .map(s => s + ".");
    return sentences;
  }

  function calculateLevel(letters, words, sentences) {
    if (words === 0 || sentences === 0) {
      return 0;
    }
    let level = Math.round(
      4.71 * (letters / words) + 0.5 * words / sentences - 21.43
    );
    return level <= 0 ? 0 : level;
  }

  function getAdverbs(sentence) {
    let menteWords = getMenteWords();
    return sentence
      .split(" ")
      .map(word => {
        if (
          word.replace(/[^a-z0-9. ]/gi, "").match(/mente$/) &&
          menteWords[word.replace(/[^a-z0-9. ]/gi, "").toLowerCase()] === undefined
        ) {
          data.adverbs += 1;
          return `<span class="adverb">${word}</span>`;
        } else {
          return word;
        }
      })
      .join(" ");
  }

  function getComplex(sentence) {
    let words = getComplexWords();
    let wordList = Object.keys(words);
    wordList.forEach(key => {
      sentence = findAndSpan(sentence, key, "complex");
    });
    return sentence;
  }

  function findAndSpan(sentence, string, type) {
    let index = sentence.toLowerCase().indexOf(string);
    let a = { complex: "complex", qualifier: "adverbs" };
    if (index >= 0) {
      data[a[type]] += 1;
      sentence =
        sentence.slice(0, index) +
        `<span class="${type}">` +
        sentence.slice(index, index + string.length) +
        "</span>" +
        findAndSpan(sentence.slice(index + string.length), string, type);
    }
    return sentence;
  }

  function getQualifier(sentence) {
    let qualifiers = getQualifyingWords();
    let wordList = Object.keys(qualifiers);
    wordList.forEach(key => {
      sentence = findAndSpan(sentence, key, "qualifier");
    });
    return sentence;
  }

  function getQualifyingWords() {
    return {
      "eu acredito": 1,
      "eu considero": 1,
      "eu não acredito": 1,
      "eu não considero": 1,
      "eu não sinto": 1,
      "eu não sugiro": 1,
      "eu não acho": 1,
      "eu sinto": 1,
      "eu espero que": 1,
      "eu devo": 1,
      "eu sugiro": 1,
      "eu acho": 1,
      "eu estava me perguntando": 1,
      "eu vou tentar": 1,
      "eu imagino": 1,
      "na minha opinião": 1,
      "é uma espécie de": 1,
      "é um tipo de": 1,
      apenas: 1,
      talvez: 1,
      possivelmente: 1,
      sim: 1,
      acaso: 1,
      porventura: 1,
      quiçá: 1, 
      assaz: 1, 
      bastante: 1, 
      bem: 1, 
      demais: 1, 
      mais: 1, 
      menos: 1, 
      muito: 1, 
      pouco: 1, 
      quanto: 1, 
      quão: 1, 
      quase: 1, 
      tanto: 1, 
      tão: 1,
      abaixo: 1, 
      acima: 1, 
      adiante: 1, 
      aí: 1, 
      além: 1, 
      ali: 1, 
      aquém: 1, 
      aqui: 1, 
      atrás: 1, 
      através: 1, 
      cá: 1, 
      defronte: 1, 
      dentro: 1, 
      detrás: 1, 
      fora: 1, 
      junto: 1, 
      lá: 1, 
      longe: 1, 
      onde: 1, 
      perto: 1,
      assim: 1, 
      bem: 1, 
      debalde: 1, 
      depressa: 1, 
      devagar: 1, 
      mal: 1, 
      melhor: 1, 
      pior: 1,
      não: 1, 
      tampouco: 1,
      "também não": 1,
      agora: 1, 
      ainda: 1, 
      amanhã: 1, 
      anteontem: 1, 
      antes: 1, 
      breve: 1, 
      cedo: 1, 
      depois: 1, 
      então: 1, 
      hoje: 1, 
      já: 1, 
      jamais: 1, 
      logo: 1, 
      nunca: 1, 
      ontem: 1, 
      outrora: 1, 
      sempre: 1, 
      tarde: 1,
    };
  }

  function getMenteWords() {
    return {
      provavelmente: 1,
      demasiadamente: 1,
      possivelmente: 1,
      excessivamente: 1,
      felizmente: 1,
      duramente: 1,
      teimosamente: 1,
      ricamente: 1
    };
  }

  function getComplexWords() {
    return {
      "um número de": ["um tanto", "alguns"],
      abundante: ["cheio", "farto"],
      "concordar com": ["permitir", "aceitar"],
      acelerar: ["apressar"],
      acentuar: ["sublinhar"],
      acompanhar: ["ir junto", "com"],
      realizar: ["fazer"],
      concedido: ["dado"],
      acumular: ["adicionar", "ganhar"],
      aquiescer: ["concordar"],
      adquirir: ["obter"],
      adicional: ["a mais", "extra"],
      "adjacente a": ["perto de"],
      ajuste: ["mudança"],
      admissível: ["permitido", "aceitável"],
      vantojoso: ["útil"],
      "impactar adversamente": ["machucar"],
      aconselhar: ["falar"],
      agregar: ["totalizar", "adicionar"],
      aeronave: ["avião"],
      "tudo de": ["todo"],
      aliviar: ["suavizar", "facilitar"],
      partilhar: ["dividir"],
      "já existente": ["existente"],
      alternativamente: ["ou"],
      polir: ["melhorar", "aperfeiçoar"],
      antever: ["esperar"],
      aparente: ["evidente", "transparente"],
      "como um meio de": ["para"],
      "até agora": ["ainda"],
      "a respeito de": ["sobre", "quanto a"],
      verificar: ["descobrir", "achar"],
      assistência: ["ajuda"],
      "neste momento": ["agora"],
      obter: ["receber"],
      "atribuível aos": ["por causa"],
      autorizar: ["permitir", "deixar"],
      "devido ao fato de": ["por causa"],
      demorado: ["atrasado"],
      "beneficiar de": ["aproveitar"],
      conceder: ["dar", "premiar"],
      cessar: ["parar"],
      "próximo": ["perto"],
      iniciar: ["começar"],
      "cumprir com": ["seguir"],
      relativa: ["sobre", "de"],
      consequentemente: ["então"],
      consolidar: ["juntar", "fundir"],
      constitui: ["é", "forma", "faz"],
      demonstrar: ["provar", "mostrar"],
      partir: ["deixar", "ir"],
      designar: ["escolher", "nomear"],
      interromper: ["largar", "parar"],
      "devido ao fato de": ["por causa de", "desde que"],
      econômico: ["barato"],
      eliminar: ["cortar", "largar", "finalizar"],
      elucidar: ["explicar"],
      ocupar: ["usar"],
      esforço: ["tentativa"],
      numerar: ["contar"],
      equitativo: ["justo"],
      equivalente: ["igual"],
      avaliar: ["testar", "checar"],
      evidenciado: ["mostrado"],
      exclusivamente: ["somente"],
      consumir: ["gastar"],
      expiração: ["fim"],
      facilitar: ["amenizar", "ajudar"],
      "evidência factual": ["fato", "evidência"],
      realizável: ["praticável"],
      finalizar: ["completar", "terminar"],
      "em primeiro lugar": ["primeiro"],
      "para o propósito de": ["para"],
      ceder: ["perder", "desistir"],
      formular: ["planejar"],
      "verdade verdadeira": ["verdade"],
      contudo: ["mas", "porém"],
      "se e quando": ["se", "quando"],
      impactado: ["afetado", "ferido", "mudado"],
      implementar: ["instalar", "colocar no lugar", "instrumento"],
      "em tempo hábil": ["a tempo"],
      "de acordo com": ["conforme", "segundo"],
      "além do mais": ["também", "aliás", "ademais"],
      "com toda a probabilidade": ["provavelmente"],
      "em um esforço para": ["para"],
      "no meio": ["entre"],
      "em excesso de": ["mais do que"],
      "em vez de": ["ao invés de"],
      "à clareza do fato de que": ["porque"],
      "em muitos casos": ["frequentemente"],
      "a fim de": ["para"],
      "em relação": ["sobre", "relativo a", "quanto a"],
      "em alguns momentos": ["às vezes"],
      "em termos de": ["omitir"],
      "em um futuro próximo": ["em breve"],
      "em processo de": ["omitir"],
      começo: ["início"],
      "encarregado de": ["deve"],
      apontar: ["dizer", "indicar", "ou mostrar"],
      indicação: ["sinal"],
      iniciar: ["começar"],
      "é aplicável a": ["se aplica para"],
      "está autorizado a": ["pode"],
      "é responsável por": ["cuida"],
      "é essencial": ["obrigação", "necessário"],
      literalmente: ["omitir"],
      magnitude: ["tamanho"],
      máximo: ["o melhor", "o maior", "a maioria"],
      metodologia: ["metódo"],
      minimizar: ["cortar"],
      mínimo: ["o menos importante", "o menor", "pequeno"],
      modificação: ["mudança"],
      monitorar: ["checar", "cuidar", "acompanhar"],
      múltiplo: ["vários"],
      necessitar: ["obrigar", "precisar"],
      "mesmo assim": ["ainda", "além do mais", "também"],
      "não tenho certeza": ["incerto"],
      "não muitos": ["poucos"],
      "não frequentemente": ["raramente"],
      "não a menos que": ["somente se"],
      "não muito diferente": ["similar", "parecido"],
      "não obstante": ["apesar de", "ainda"],
      "nulo e vazio": ["use ou nulo ou void"],
      numeroso: ["muitos"],
      objetivo: ["meta", "alvo"],
      obligate: ["bind", "compel"],
      obter: ["conseguir"],
      "pelo contrário": ["mas", "portanto"],
      "por outro lado": ["omitir", "mas", "portanto"],
      "um em particular": ["um"],
      ótimo: ["melhor", "o melhor", "o máximo"],
      "no geral": ["omitir"],
      "devido ao fato de": ["por causa", "desde"],
      participaar: ["tomar parte"],
      particularidades: ["detalhes"],
      "falecer": ["morrer"],
      "pertencente": ["a cerca de", "de", "em"],
      "momento no tempo": ["tempo", "segundo", "momento", "agora"],
      porção: ["parte"],
      portar: ["ter", "possuir"],
      impedir: ["previnir"],
      previamente: ["antes"],
      "anterior a": ["antes"],
      priorizar: ["dar atenção a", "focar em"],
      procure: ["buy", "get"],
      proficiência: ["habilidade"],
      "contanto que": ["se"],
      aquisição: ["compra", "liquidação"],
      "simplificando": ["omitir"],
      "facilmente aparente": ["claro"],
      "consultar de volta": ["consultar"],
      "a respeito de": ["sobre", "de", "relativo"],
      realocar: ["mover"],
      restante: ["resto"],
      remuneração: ["pagamento"],
      exigir: ["obrigar", "necessitar"],
      requisito: ["exigência", "condição"],
      residir: ["morar"],
      residência: ["casa"],
      reter: ["manter"],
      satisfazer: ["contentar", "corresponder"],
      shall: ["must", "will"],
      "como desejar": ["se você quiser"],
      "similar a": ["como"],
      solicitar: ["pedir", "demandar"],
      "cruzar": ["atravessar", "através de"],
      estratégia: ["plano"],
      subsequente: ["seguinte", "próximo", "depois", "consecutivo"],
      substancial: ["grande", "muito"],
      "concluído com sucesso": ["completo", "passar"],
      suficiente: ["o bastante"],
      encerrar: ["finalizar", "parar"],
      "o mês de": ["omitir"],
      portanto: ["assim", "então"],
      "nesse dia e nessa era": ["hoje"],
      "período de tempo": ["tempo", "período"],
      "aproveitou": ["apreciou"],
      transmitir: ["enviar "],
      transpirar: ["acontecer"],
      "até o momento em que": ["até que"],
      utilização: ["uso"],
      utilizar: ["usar"],
      validar: ["confirmar"],
      "vários diferentes": ["vários", "diferentes"],
      "independente da resposta": ["independente"],
      "em relação a": ["sobre", "a respeito de"],
      "com a exceção de": ["exceto por"],
      testemunhou: ["viu", "presenciou"]
    };
  }

  function getJustifierWords() {
    return {
      "eu acredito": 1,
      "eu considero": 1,
      "eu não acredito": 1,
      "eu não considero": 1,
      "eu não sinto": 1,
      "eu não sugiro": 1,
      "eu não acho": 1,
      "eu sinto": 1,
      "eu espero que": 1,
      "eu devo": 1,
      "eu sugiro": 1,
      "eu acho": 1,
      "eu estava me perguntando": 1,
      "eu vou tentar": 1,
      "eu imagino": 1,
      "na minha opinião": 1,
      "é uma espécie de": 1,
      "é um tipo de": 1,
      apenas: 1,
      talvez: 1,
      possivelmente: 1,
      "nós acreditamos": 1,
      "nós consideramos": 1,
      "nós não acreditamos": 1,
      "nós não consideramos": 1,
      "nós não sentimos": 1,
      "nós não sugerimos": 1,
      "nós não achamos": 1,
      "nós sentimos": 1,
      "nós esperamos que": 1,
      "nós podemos": 1,
      "nós sugerimos": 1,
      "nós pensamos": 1,
      "nós estávamos nos perguntando": 1,
      "nós vamos tentar": 1,
      "nós imaginamos": 1
    };
  }
})();