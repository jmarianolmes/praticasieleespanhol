export type ExamQuestion = {
  number: number;
  prompt: string;
  options: [string, string, string, string];
  correctOption: "A" | "B" | "C" | "D";
  isScored: boolean;
  isReserve: boolean;
};

export const MERCANCIAS_EXAM = [
  {
    "number": 1,
    "prompt": "¿Qué podemos decir de la cooperativa de trabajo asociado?",
    "options": [
      "Resulta de la asociación de varias personas que aportan solo capital.",
      "Deberá contar con un mínimo de dos socios.",
      "Los socios ven limitada su responsabilidad por las deudas sociales, a las aportaciones realizadas.",
      "Resulta de la asociación de varias personas que aportan solo trabajo."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 2,
    "prompt": "El documento de control administrativo de un transporte público de mercancías:",
    "options": [
      "deberá ajustarse a un modelo determinado.",
      "se editará por las asociaciones de transportistas.",
      "será de libre edición.",
      "se editará por el Comité Nacional del Transporte por Carretera."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 3,
    "prompt": "En el caso de la cooperativa de trabajo asociado:",
    "options": [
      "el capital social mínimo se determina en los estatutos.",
      "el capital social se divide en acciones.",
      "la cooperativa se inscribe en el Registro Mercantil.",
      "la cooperativa debe tributar por el IRPF."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 4,
    "prompt": "En un camión en movimiento, ¿qué es el sobreviraje?",
    "options": [
      "Es el movimiento giratorio de la carrocería sobre un eje transversal a la marcha.",
      "Es una trayectoria real del vehículo más abierta de la que debería realizar.",
      "Es el movimiento de giro sobre el eje vertical.",
      "Es una trayectoria real del vehículo más cerrada de la que debería realizar."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 5,
    "prompt": "Si observamos en el círculo de Kamm que aumenta la fuerza de frenado:",
    "options": [
      "el camión gana estabilidad.",
      "el camión ni gana ni pierde estabilidad.",
      "el camión pierde estabilidad, puesto que disminuye la fuerza de guiado lateral.",
      "el camión gana estabilidad, puesto que disminuye la fuerza de guiado lateral."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 6,
    "prompt": "¿Qué implica el hecho de circular con un camión con más carga en una pendiente ascendente?",
    "options": [
      "Más esfuerzo para moverlo, lo que significa que se realizará una subida más rápida.",
      "Más esfuerzo para moverlo, lo que significa que se realizará una subida más lenta.",
      "Menos esfuerzo para moverlo, lo que significa que se realizará una subida más rápida.",
      "Menos esfuerzo para moverlo, lo que significa que se realizará una subida más lenta."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 7,
    "prompt": "Cuando un camión se encuentra inmóvil, la suma de las fuerzas y los pares es:",
    "options": [
      "igual a cero.",
      "desigual a cero.",
      "igual a diez.",
      "igual a cien."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 8,
    "prompt": "Si la resultante de las fuerzas de frenado y de guiado lateral se encuentra dentro del círculo de Kamm, el camión:",
    "options": [
      "pierde estabilidad.",
      "es imposible de controlar.",
      "puede dirigirse sin problemas.",
      "sufre un accidente."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 9,
    "prompt": "Las asambleas generales de las cooperativas se anunciarán en un diario de gran difusión, en el territorio en el que la cooperativa tenga su ámbito de actuación, cuando la cooperativa tenga más de:",
    "options": [
      "500 socios.",
      "350 socios.",
      "250 socios.",
      "125 socios."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 10,
    "prompt": "¿Qué considera la normativa como transporte interior de mercancías?",
    "options": [
      "El realizado en el interior de las poblaciones de forma exclusiva.",
      "El transporte que no sobrepasa los límites de un país.",
      "El realizado dentro del espacio Schengen.",
      "El realizado dentro de Europa."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 11,
    "prompt": "¿A qué se llama embalaje primario?",
    "options": [
      "Es aquel que está en contacto directo con el producto.",
      "Al que se realiza con materiales desechables como cartón, papel, etc.",
      "Respecto de una carga, al que sea más ligero.",
      "Al que se utiliza para transportar productos dentro de sus envases."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 12,
    "prompt": "¿Cómo se deben utilizar las cuñas para fijar la carga?",
    "options": [
      "Apoyadas en las paredes de la caja del vehículo.",
      "Fijadas a la parte delantera y trasera de la carga por medio de cables metálicos.",
      "Apoyadas en el suelo de la caja del vehículo.",
      "Las tres respuestas anteriores son correctas."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 13,
    "prompt": "Si las mercancías no están suficientemente compactadas, ¿qué puede pasar?",
    "options": [
      "Existirá riesgo de desplazamiento de la carga y de disminución de la tensión en los dispositivos de sujeción.",
      "Se puede producir una tensión extra en el compartimento de carga.",
      "Se producirá una vibración que hará que aumente el consumo de carburante.",
      "Se pueden producir pequeños desequilibrios en la conducción."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 14,
    "prompt": "En una sociedad anónima, el capital social no puede ser nunca inferior a:",
    "options": [
      "30.000 euros.",
      "60.000 euros.",
      "100.000 euros.",
      "120.000 euros."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 15,
    "prompt": "¿Cuál de estas afirmaciones es incorrecta?",
    "options": [
      "Los transitarios son organizadores de transportes internacionales.",
      "Un grupo de actividades complementarias del transporte lo constituyen las de almacenaje y distribución.",
      "Las empresas de almacenaje y distribución se denominan genéricamente operarios de transporte de mercancías.",
      "Las actividades de transitario y de almacenaje y distribución requieren contar con autorización administrativa."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 16,
    "prompt": "¿Se exige alguna aprobación específica de los vehículos que se utilizan en un transporte TIR?",
    "options": [
      "No, solo que vayan identificados con la placa TIR.",
      "No, solo que vayan identificados con la placa TIR y estén matriculados en el país de partida del transporte.",
      "Sí, están sujetos a aprobación y deben obtener un certificado.",
      "Se requiere su aprobación previa, pero solo para el transporte de mercancías que presentan un mayor riesgo de fraude (tabaco, alcohol y similares)."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 17,
    "prompt": "¿Cuál de los siguientes transportes internacionales de mercancías entre países integrados en el sistema de autorizaciones CEMT necesita autorización?",
    "options": [
      "Los transportes de vehículos accidentados o averiados.",
      "Los transportes de animales vivos en vehículos acondicionados de forma permanente para este fin.",
      "Las mudanzas.",
      "Ninguno de los anteriores transportes necesita autorización."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 18,
    "prompt": "El transporte de mercancías por carretera en régimen de cabotaje...",
    "options": [
      "lo pueden realizar los transportistas establecidos en la Unión Europea que dispongan de licencia comunitaria.",
      "está liberalizado y puede realizarlo cualquier transportista de nacionalidad comunitaria.",
      "necesita una autorización especial de cabotaje.",
      "está prohibido, salvo excepciones."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 19,
    "prompt": "En un contrato de transporte sujeto al Convenio CMR, ¿qué indicaciones debe contener la carta de porte?",
    "options": [
      "Si procede, instrucciones sobre el seguro de la mercancía.",
      "Si procede, plazo convenido para la realización del transporte.",
      "Si procede, lista de documentos entregados al transportista.",
      "Todas las respuestas anteriores son correctas."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 20,
    "prompt": "¿Qué finalidad cumplen los certificados de circulación de mercancías EUR.1?",
    "options": [
      "Acreditar el país de origen de las mercancías a las que se refieren.",
      "Acreditar que las mercancías proceden de un territorio que se beneficia de determinadas preferencias arancelarias o que se consideran originarias de la Unión Europea.",
      "Permitir en todo momento el conocimiento de dónde se encuentra una mercancía que está siendo objeto de un transporte internacional.",
      "Facilitar los trámites aduaneros de la mercancía a la que se refieren."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 21,
    "prompt": "¿En qué año se firmó el Convenio aduanero ATA?",
    "options": [
      "1956.",
      "1960.",
      "1961.",
      "1963."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 22,
    "prompt": "¿En cuál de los siguientes supuestos se puede utilizar un cuaderno ATA?",
    "options": [
      "Importación temporal de equipos profesionales.",
      "Importación de trigo para la fabricación de harina.",
      "Importación de material sanitario para su venta.",
      "Las respuestas A y B son correctas."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 23,
    "prompt": "¿Puede utilizarse el cuaderno ATA como documento válido para transportar mercancías en régimen de tránsito aduanero?",
    "options": [
      "Sí.",
      "Sí, pero solo para mercancías que no presenten un nivel elevado de fraude.",
      "No, el cuaderno ATA debe estar acompañado siempre por el cuaderno TIR.",
      "No, el cuaderno ATA debe estar acompañado siempre por el cuaderno TIR o por el documento de tránsito comunitario."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 24,
    "prompt": "¿Se han desarrollado las condiciones de uso de las cartas de porte electrónicas en el transporte de mercancías por carretera?",
    "options": [
      "Sí, en los transportes de ámbito nacional.",
      "Sí, en los transportes sujetos al Convenio CMR.",
      "No.",
      "Las respuestas A y B son correctas."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 25,
    "prompt": "Las autorizaciones bilaterales de transporte internacional de mercancías denominadas de zona larga son válidas para:",
    "options": [
      "transportes de más de 300 km con origen o destino en España y destino u origen en el país de que se trate.",
      "transportes de más de 500 km con origen o destino en España y destino u origen en el país de que se trate.",
      "transportes de más de 1.000 km con origen o destino en España y destino u origen en el país de que se trate.",
      "cualquier transporte con origen o destino en España y destino u origen en el país de que se trate."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 26,
    "prompt": "¿Cómo se considera en la normativa de transporte el exceso superior al 50 % en los tiempos máximos de conducción diaria?",
    "options": [
      "Infracción leve.",
      "Infracción grave.",
      "Infracción muy grave.",
      "Delito."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 27,
    "prompt": "La intervención de los autobuses y vehículos de transporte de mercancías en accidentes de tráfico con víctimas, si se pondera por los vehículos-kilómetro recorridos anualmente, es:",
    "options": [
      "menor que la del resto de vehículos.",
      "mayor que la del resto de vehículos.",
      "igual que la del resto de vehículos.",
      "Todas las respuestas anteriores son incorrectas."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 28,
    "prompt": "La realización de transportes de fondos u objetos de valor en vehículos especialmente equipados para ello está:",
    "options": [
      "obligada al uso de tacógrafo, pero analógico.",
      "exenta del uso de tacógrafo.",
      "obligada al uso de tacógrafo.",
      "obligada al uso de tacógrafo, pero digital."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 29,
    "prompt": "La resistencia aerodinámica",
    "options": [
      "crece de manera inversamente proporcional a la aceleración.",
      "crece con el cuadrado de la velocidad.",
      "crece con el doble de la velocidad.",
      "decrece ligeramente con el incremento de la velocidad."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 30,
    "prompt": "Las empresas de transporte, al tomar medidas preventivas adecuadas, producen una serie de efectos positivos adicionales. ¿Cuál es uno de ellos?",
    "options": [
      "Mayor motivación de los trabajadores.",
      "Mejores relaciones laborales.",
      "Incremento de la satisfacción en el puesto de trabajo.",
      "Todas las respuestas anteriores son correctas."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 31,
    "prompt": "Conducción semanal es el tiempo acumulado total de conducción durante una semana. ¿A partir de qué momento se contabiliza ese tiempo?",
    "options": [
      "Desde el inicio del período de conducción hasta transcurridos 6 períodos más.",
      "Desde las cero horas del día en que empieza a conducir hasta las 24 horas del séptimo día posterior.",
      "Desde las cero horas del lunes hasta las 24 horas del domingo.",
      "Desde las cero horas del lunes hasta que se produzca un descanso semanal."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 32,
    "prompt": "El cambio de los filtros, aceites y bujías, ¿afecta al consumo de combustible?",
    "options": [
      "Sí, los tres influyen.",
      "No, solo influyen los filtros y las bujías.",
      "No, solo influyen los filtros y el aceite.",
      "No, solo influyen los filtros."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 33,
    "prompt": "En las estadísticas de accidentes de tráfico, el índice de mortalidad hace referencia al número:",
    "options": [
      "de accidentes con víctimas respecto del número de kilómetros recorridos.",
      "de fallecidos respecto del número de kilómetros recorridos.",
      "de heridos graves respecto del número de kilómetros recorridos.",
      "Ninguna de las respuestas anteriores es correcta."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 34,
    "prompt": "El Instituto Nacional de Seguridad e Higiene en el Trabajo aconseja que los pesos que se levanten en posición sentado no sean superiores a:",
    "options": [
      "10 kg.",
      "15 kg.",
      "5 kg.",
      "20 kg."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 35,
    "prompt": "En la secuencia de un accidente suele hablarse de tres fases, ¿cuáles son?",
    "options": [
      "Percepción, decisión e impacto.",
      "Decisión, impacto y consecuencia.",
      "Maniobra, impacto y decisión.",
      "Todas las respuestas anteriores son incorrectas"
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 36,
    "prompt": "¿Cómo define la \"pausa\" el Reglamento (CE) 561/2006?",
    "options": [
      "Cualquier período ininterrumpido durante el cual un conductor pueda disponer libremente de su tiempo superior a 5 minutos.",
      "Cualquier período durante el cual un conductor no pueda llevar a cabo ninguna actividad de conducción u otro trabajo y que sirva exclusivamente para su reposo.",
      "Cualquier período de descanso de, al menos, 11 horas.",
      "Cualquier período superior a 30 minutos."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 37,
    "prompt": "Los transportes efectuados mediante vehículos que se sometan a pruebas en carretera y vehículos nuevos o transformados que aún no se hayan puesto en circulación:",
    "options": [
      "deben usar un tacógrafo no activado.",
      "están exentos del uso de tacógrafo.",
      "deben usar un tacógrafo no calibrado.",
      "están obligados al uso de un tacógrafo especial."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 38,
    "prompt": "Para ahorrar combustible, ¿cómo deben realizarse los cambios de marchas?",
    "options": [
      "Hacia marchas más largas, cuando el cuentarrevoluciones entre las 1.500 y 2.000 en motores diésel.",
      "Hacia marchas cortas cuando el cuentarrevoluciones se encuentre entre 1.000 y 1.500 revoluciones.",
      "Hacia marchas más largas cuando el cuentarrevoluciones se encuentre entre 3.000 y 3.500 revoluciones en motores diésel.",
      "Hacia marchas cortas cuando el cuentarrevoluciones supere las 2.000 revoluciones en motores diésel."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 39,
    "prompt": "En caso de aplicar una sanción por una infracción relacionada con la normativa de tiempos de conducción y descanso, ¿qué se debe entregar al conductor?",
    "options": [
      "Justificación escrita de las pruebas de la infracción.",
      "Un documento que indique la hora de la inspección.",
      "Un documento que indique el lugar de la inspección.",
      "Documentos en el idioma que hable el conductor."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 40,
    "prompt": "¿A quién se considera persona implicada en un accidente de tráfico a efectos estadísticos?",
    "options": [
      "A los peatones que resulten afectados por el accidente.",
      "A los peatones que hayan ayudado a las víctimas del accidente.",
      "A los peatones que hayan presenciado el accidente, aunque no hayan ayudado a las víctimas.",
      "Todas las respuestas son correctas."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 41,
    "prompt": "¿Se puede saber qué Estado ha homologado un tacógrafo viendo la marca de homologación?",
    "options": [
      "Sí, puesto que el número que hay fuera del rectángulo identifica al Estado que concede la homologación.",
      "No se puede saber.",
      "Sí, puesto que el número que hay dentro del rectángulo identifica al Estado que concede la homologación.",
      "Sí, pero hay que llevar el tacógrafo a un taller."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 42,
    "prompt": "¿Dónde se aplica peor la normativa sobre prevención de riesgos laborales en el conjunto de las empresas españolas de transporte por carretera?",
    "options": [
      "En las empresas que tienen entre 1 y 5 trabajadores.",
      "En las empresas que tienen entre 6 y 15 trabajadores.",
      "En las empresas que tienen entre 16 y 49 trabajadores.",
      "En las empresas con más de 50 trabajadores."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 43,
    "prompt": "¿Cómo se pueden definir los accidentes con forma no traumática?",
    "options": [
      "Enfermedades con comienzo repentino y de origen no violento.",
      "Enfermedades de origen violento.",
      "Enfermedades con una duración de las bajas laborales sustancialmente menor que en el resto de los accidentes de trabajo.",
      "Ninguna de las respuestas anteriores es correcta."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 44,
    "prompt": "¿Cómo es la marca de homologación que debe tener el tacógrafo?",
    "options": [
      "Un número y la letra \"h\" dentro de un círculo.",
      "Un cuadro con la letra \"e\" y un número fuera del cuadrado.",
      "Un rectángulo con la primera letra del país que hace la homologación y cerca del mismo el número de homologación.",
      "La letra \"e\" minúscula y el número del país que homologa dentro de un rectángulo, acompañados del número de homologación en un lugar cercano."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 45,
    "prompt": "Los diferentes bloques de tiempo se registran en el tacógrafo analógico:",
    "options": [
      "solamente cuando el vehículo se mueve.",
      "solamente cuando el vehículo está parado.",
      "una vez que el conductor ha seleccionado el tipo de actividad que realiza.",
      "al insertar la tarjeta de conductor."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 46,
    "prompt": "¿En qué hora deben grabarse las actividades en el disco-diagrama u hoja de registro de un tacógrafo analógico?",
    "options": [
      "En hora UTC.",
      "En la hora del país de matriculación del vehículo.",
      "En la hora local de cada país por el que se circule.",
      "En hora UTC más 2 horas."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 47,
    "prompt": "A efectos de la aplicación de la normativa sobre extranjería, ¿cuál de los siguientes países no pertenece al llamado \"Espacio Schengen\"?",
    "options": [
      "Reino Unido de Gran Bretaña e Irlanda del Norte.",
      "Suecia.",
      "Italia.",
      "España."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 48,
    "prompt": "¿Cuál es el concepto de \"par motor\"?",
    "options": [
      "Es el trabajo realizado en la unidad de tiempo.",
      "Es el esfuerzo necesario para hacer girar las ruedas del vehículo.",
      "Es el esfuerzo que transmite el pistón sobre el cigüeñal y, por tanto, sobre el volante de inercia.",
      "Es el trabajo necesario para hacer girar las ruedas del vehículo."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 49,
    "prompt": "¿Cuántas veces se podrá interrumpir, para llevar a cabo otras actividades, el período de descanso diario normal cuando se acompañe un vehículo transportado por trasbordador o tren?",
    "options": [
      "El período de descanso diario normal nunca puede interrumpirse.",
      "Se podrá interrumpir un máximo de tres veces, siempre que no excedan en total de una hora.",
      "Se podrá interrumpir un máximo de dos veces, siempre que no excedan en total de dos horas.",
      "Se podrá interrumpir un máximo de dos veces, siempre que no excedan en total de una hora."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 50,
    "prompt": "Si, debido a las circunstancias climatológicas adversas de hielo o nieve, fuese obligatorio el uso de cadenas, ¿dónde se deberán poner estas?",
    "options": [
      "En todas las ruedas del vehículo.",
      "Solo en las ruedas delanteras.",
      "Solo en las ruedas traseras.",
      "Al menos en una rueda a cada lado del eje motriz."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 51,
    "prompt": "Los transportes de recogida de leche en las granjas que se desarrollen íntegramente en un radio de 100 kilómetros alrededor del centro de explotación de la empresa titular del vehículo:",
    "options": [
      "están exentos de llevar instalado tacógrafo.",
      "deben llevar instalado un tacógrafo especial.",
      "deben llevar tacógrafo exclusivamente si el transporte es público.",
      "deben llevar tacógrafo si la MMA del vehículo es superior a 7,5 toneladas."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 52,
    "prompt": "¿Para qué sirven los reposacabezas?",
    "options": [
      "Para intentar disminuir la gravedad de las lesiones en el cuello y las vértebras que se producen como consecuencia de un movimiento brusco.",
      "Para dar comodidad al conductor.",
      "Son un elemento decorativo.",
      "No sirven para nada."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 53,
    "prompt": "¿En cuántas categorías se clasifican los medicamentos en función de su incidencia sobre la conducción de vehículos?",
    "options": [
      "En dos.",
      "En tres.",
      "En cuatro.",
      "En cinco."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 54,
    "prompt": "¿Qué circunstancia de las siguientes no será motivo de inmovilización de un vehículo en una inspección de transporte en carretera?",
    "options": [
      "La falta de uniformidad del conductor.",
      "El exceso de peso que constituya infracción grave o muy grave.",
      "El exceso en los tiempos de conducción que constituya infracción muy grave.",
      "La minoración de los tiempos de descanso que constituya infracción muy grave."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 55,
    "prompt": "¿En qué se basa el funcionamiento del ralentizador eléctrico?",
    "options": [
      "En el aprovechamiento de la energía cinética.",
      "En el aprovechamiento de la energía calorífica.",
      "En el frotamiento entre dos elementos de alto coeficiente de rozamiento.",
      "En la creación de un campo magnético."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 56,
    "prompt": "En caso de que el motor de alguno de los vehículos implicados en un accidente continúe en marcha, ¿qué se deberá hacer?",
    "options": [
      "Desconectar el contacto del vehículo, pero solo cuando llegue la policía.",
      "Desconectar inmediatamente el contacto.",
      "Dejarlo funcionando.",
      "Ninguna de las respuestas anteriores es correcta."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 57,
    "prompt": "¿Cuáles son los accidentes laborales que, con más frecuencia, tienen consecuencias mortales en la actividad de transporte?",
    "options": [
      "Proyección de líquidos contra el cuerpo y caídas de personas a distinto nivel.",
      "Exposición a sustancias tóxicas y atropellos.",
      "Descargas eléctricas y sobreesfuerzos.",
      "Los atropellos y las caídas de personas a distinto nivel."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 58,
    "prompt": "¿Cómo se puede definir la enfermedad profesional?",
    "options": [
      "Enfermedades con comienzo repentino y de origen no violento.",
      "Aquella que presenta relación con una determinada rama de actividad u ocupación.",
      "Aquella que se produce como consecuencia de un accidente en el trabajo.",
      "Aquella que se produce de camino al trabajo."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 59,
    "prompt": "¿Dónde se deberá colocar la parte central del reposacabezas?",
    "options": [
      "A la altura de la coronilla.",
      "A la altura del cuello.",
      "A la altura de las orejas.",
      "A la altura de la boca."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 60,
    "prompt": "¿Qué fármacos pueden producir pérdida de capacidad auditiva?",
    "options": [
      "Analgésicos.",
      "Antihistamínicos.",
      "Antihipertensivos.",
      "Relajantes."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 61,
    "prompt": "¿Cuáles son los efectos que suelen producir los estimulantes en la conducción?",
    "options": [
      "Un estado semejante a la embriaguez, en el cual disminuye la apreciación del riesgo.",
      "Un fuerte shock con convulsiones y calambres, pudiendo originar actuaciones violentas.",
      "Una sobrevaloración de la propia capacidad y un exceso de confianza.",
      "Desorientación y síntomas parecidos a la borrachera."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 62,
    "prompt": "En caso de pérdida de control del vehículo con hielo en la calzada, ¿cómo se debe actuar?",
    "options": [
      "Debe frenarse, levantar suavemente el pie del acelerador y dirigir el volante hacia el lado a donde vaya la parte delantera del vehículo.",
      "No debe frenarse, levantar suavemente el pie del acelerador y dirigir el volante hacia el lado a donde vaya la parte trasera del vehículo.",
      "No debe frenarse, levantar suavemente el pie del acelerador y dirigir el volante hacia el lado a donde vaya la parte delantera del vehículo.",
      "Debe frenarse, pisar suavemente el pie del acelerador y dirigir el volante hacia el lado a donde vaya la parte trasera del vehículo."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 63,
    "prompt": "¿Cuándo tiene el alcohol una absorción más rápida en la sangre?",
    "options": [
      "Si tiene una graduación baja.",
      "Si se consume caliente.",
      "Si no está gasificado.",
      "Si el estómago está lleno."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 64,
    "prompt": "¿En qué momento hay que extremar la precaución en caso de viento fuerte?",
    "options": [
      "Al entrar en un túnel.",
      "Circulando por ciudad.",
      "Al cruzarse con un ciclomotor.",
      "Al cruzarse con un vehículo de gran tonelaje."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 65,
    "prompt": "Utilizar hojas de registro no homologadas:",
    "options": [
      "no se contempla como infracción en ninguna norma.",
      "se considera infracción muy grave.",
      "se considera infracción grave.",
      "se considera infracción leve."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 66,
    "prompt": "Para conducir un vehículo para el que sea necesario el permiso de la clase C1, ¿se precisa estar en posesión del certificado de aptitud profesional (CAP)?",
    "options": [
      "No.",
      "Sí.",
      "Solo si el vehículo se destina al transporte de animales.",
      "Solo si el vehículo se destina al transporte de viajeros."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 67,
    "prompt": "¿Qué se consigue al diseñar tareas que incluyan el mayor número posible de movimientos reflejos y automáticos?",
    "options": [
      "Que la mente se fatigue menos.",
      "Mantener los músculos alerta.",
      "Prevenir posibles lesiones cervicales.",
      "Todas las respuestas son correctas."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 68,
    "prompt": "La cantidad de carburante que gasta un motor en relación a la potencia desarrollada en un tiempo determinado se llama:",
    "options": [
      "consumo parcial.",
      "consumo total.",
      "consumo extra.",
      "consumo específico."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 69,
    "prompt": "¿Está exento del uso de tacógrafo un vehículo cuya velocidad máxima autorizada no supere 40 kilómetros por hora?",
    "options": [
      "Sí.",
      "No.",
      "Solo si su MMA no supera 6 toneladas.",
      "Solo si se destina al transporte urbano."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 70,
    "prompt": "¿Se considera infracción llevar instalado un tacógrafo analógico cuando, por la fecha de matriculación del vehículo, el tacógrafo instalado debería ser digital?",
    "options": [
      "Sí, se considera una infracción grave.",
      "No, no se considera infracción.",
      "Sí, se considera una infracción muy grave.",
      "Sí, se considera infracción grave, pero si efectúa el cambio de tacógrafo en 15 días se calificará como leve."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 71,
    "prompt": "¿Pueden los agentes de control trasladar el vehículo a un taller mecánico cualquiera en caso de indicios de una manipulación del tacógrafo?",
    "options": [
      "Sí, siempre.",
      "Sí, pero solo si no hay un taller autorizado a menos de 15 km.",
      "No, tiene que ser un taller autorizado.",
      "Sí, pero solo en caso de que se trate de mal funcionamiento del tacógrafo."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 72,
    "prompt": "Los delitos de contrabando se castigan con penas de prisión de uno a cinco años y multa:",
    "options": [
      "del doble al triple del valor de las mercancías objeto del delito.",
      "del quíntuplo del valor de las mercancías objeto del delito.",
      "del triple del valor de las mercancías objeto del delito.",
      "del tanto al séxtuplo del valor de las mercancías objeto del delito."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 73,
    "prompt": "En las estadísticas oficiales de accidentes de tráfico no se tienen en cuenta:",
    "options": [
      "los provocados por muertes naturales confirmadas, en todos los casos.",
      "los que se producen en un terreno en el que no se aplica la legislación sobre tráfico de vehículos.",
      "los provocados por conductores sin permiso de conducción.",
      "aquellos en los que está implicado un vehículo policial."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 74,
    "prompt": "¿Quién comunica a los servicios encargados de la elaboración de la estadística los datos relativos a un accidente de circulación con víctimas?",
    "options": [
      "La Dirección General de Tráfico.",
      "Los agentes de la autoridad encargados de la vigilancia y el control del tráfico.",
      "La Comunidad Autónoma correspondiente.",
      "La Jefatura Provincial de Tráfico correspondiente."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 75,
    "prompt": "¿Qué muestra la curva de potencia a plena carga?",
    "options": [
      "La potencia de rueda necesaria para el transporte de la MMA del vehículo.",
      "La potencia que genera el par máximo con el vehículo a plena carga.",
      "La potencia que entrega el motor a cada régimen de giro cuando el acelerador se pisa fondo.",
      "El consumo a potencia máxima con MMA transportada."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 76,
    "prompt": "¿Qué son las curvas de equiconsumo?",
    "options": [
      "Las que representan el consumo medio de un par motor.",
      "Las que representan consumo específico constante.",
      "Las que representan el consumo medio de una potencia determinada.",
      "Las que representan el consumo medio de un par rueda."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 77,
    "prompt": "¿Qué son los sistemas IVMS?",
    "options": [
      "Son sistemas de ayuda a la conducción.",
      "Son sistemas de control de emisiones de los vehículos.",
      "Son sistemas de vigilancia de los vehículos.",
      "Son sistemas de gestión logística de almacenes."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 78,
    "prompt": "El sistema de ayuda a la conducción con la función de reconocer señales de tráfico e informar al conductor también es conocido como",
    "options": [
      "ACC.",
      "TSR.",
      "LKA.",
      "IHC."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 79,
    "prompt": "Entre las ventajas de realizar un mantenimiento preventivo está:",
    "options": [
      "poder circular a más velocidad.",
      "disminuir la resistencia al aire.",
      "ajustar el consumo de carburante.",
      "elevar la energía calorífica centrípeta."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 80,
    "prompt": "¿En qué porcentaje reducen el consumo de combustible los deflectores en techo?",
    "options": [
      "15%.",
      "10%.",
      "8%.",
      "6%."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 81,
    "prompt": "¿Qué tipo de batería de vehículo eléctrico es la que tiene menor peso?",
    "options": [
      "Vanadio.",
      "Cromo.",
      "Litio.",
      "Níquel."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 82,
    "prompt": "¿Qué ocurre si se levanta el pie del acelerador, dejando rodar el vehículo por su propia inercia, conla marcha en la que se circula engranada y el motor girando por encima del ralentí?",
    "options": [
      "El consumo de carburante será más alto.",
      "El consumo de carburante será nulo.",
      "El consumo de carburante será más bajo.",
      "El consumo de carburante no se verá afectado."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 83,
    "prompt": "¿Qué factores inciden en la una menor variación de la intensidad de tráfico en una zona determinada de carretera?",
    "options": [
      "El carácter turístico del tráfico.",
      "La mayor proporción de tráfico pesado.",
      "La proximidad de una gran población.",
      "Todas las respuestas son correctas."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 84,
    "prompt": "El dispositivo de seguridad ABS, ¿qué acción lleva a cabo?",
    "options": [
      "Detecta si se ha producido una frenada de emergencia y corrige los defectos en los que incurre el conductor.",
      "Mide la distancia con el vehículo que circula delante y calcula la distancia de seguridad.",
      "Consigue el funcionamiento sincronizado del sistema de frenos en todas las ruedas.",
      "Si capta que se va a producir el bloqueo de una rueda, disminuye la fuerza de frenado sobre ella."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 85,
    "prompt": "¿Cómo actúa el ESP en caso de derrape del eje delantero del vehículo al tomar una curva?",
    "options": [
      "Frena la rueda delantera exterior a la curva.",
      "Frena la rueda delantera interior a la curva.",
      "Frena la rueda trasera interior a la curva.",
      "Frena la rueda trasera exterior a la curva."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 86,
    "prompt": "Ante un vehículo que circula de frente por el mismo carril, se debe tener en cuenta que¿",
    "options": [
      "la colisión lateral es la más grave.",
      "la colisión frontal es la más grave.",
      "la colisión fronto-lateral es la más grave.",
      "la colisión trasera es la más grave."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 87,
    "prompt": "Según el Reglamento (CE) 561/2006, un conductor puede prolongar su conducción diaria hasta un máximo de 1 hora si:",
    "options": [
      "el total de pausas reglamentarias acumuladas en la jornada supera las 2 horas.",
      "realiza una pausa superior a 15 minutos inmediatamente antes de realizar la prolongación de la jornada.",
      "es necesario para realizar el descanso diario en su domicilio.",
      "es necesario para realizar el descanso semanal en su domicilio."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 88,
    "prompt": "Según el Reglamento (CE) 561/2006, ¿qué conductores pueden realizar dos descansos semanales reducidos consecutivos?",
    "options": [
      "Los que se dediquen al transporte internacional de mercancías.",
      "Los que se dediquen al transporte internacional de viajeros.",
      "Los que sean habilitados expresamente por la Comisión Europea en una Resolución.",
      "Ninguno."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 89,
    "prompt": "En las estadísticas sobre accidentes de tráfico, el índice de letalidad se denomina también:",
    "options": [
      "Índice de gravedad.",
      "índice de accidentalidad.",
      "Índice de mortalidad.",
      "índice de lesividad."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 90,
    "prompt": "Señale la afirmación correcta:",
    "options": [
      "El mayor número de accidentes y los de más gravedad se producen en vías urbanas.",
      "El mayor número de accidentes y los de más gravedad se producen en vías interurbanas.",
      "El mayor número de accidentes se produce en vías urbanas, pero son de menos gravedad.",
      "El mayor número de accidentes se produce en vías interurbanas, pero son de menor gravedad."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 91,
    "prompt": "¿En qué consiste el método de las preferencias declaradas, utilizado para valorar económicamente los costes humanos de los accidentes de tráfico?",
    "options": [
      "En consultar a las compañías de seguros el montante de las indemnizaciones que han tenido que pagar por accidentes de tráfico.",
      "En realizar encuestas en las que se pregunta cuánto se estaría dispuesto a gastar para reducir el riesgo de accidentes.",
      "En capitalizar al tipo de interés de mercado el importe de la indemnización que fija la ley para fallecidos y heridos en accidentes de tráfico.",
      "En preguntar a los afectados por accidentes de tráfico el importe de los gastos en los que han incurrido a raíz del accidente."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 92,
    "prompt": "Con un consumo igual, el nivel de alcohol en sangre que se puede alcanzar es más elevado:",
    "options": [
      "con bebidas destiladas que con bebidas fermentadas.",
      "si se toma junto con bebidas gaseosas.",
      "si se toma caliente.",
      "Todas las respuestas son correctas."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 93,
    "prompt": "¿Qué incidencia sobre la conducción tienen los medicamentos incluidos en la categoría 0?",
    "options": [
      "Son seguros y raramente afectan a la capacidad de conducir.",
      "Afectan de modo leve.",
      "Afectan de manera moderada.",
      "Pueden afectar de manera intensa."
    ],
    "correctOption": "A",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 94,
    "prompt": "¿Con qué periodicidad hay que realizar el retimbrado de los extintores?",
    "options": [
      "Anualmente.",
      "Semestralmente.",
      "Cada cinco años.",
      "Cada dos años."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 95,
    "prompt": "¿Qué se quiere significar, en el marco de un modelo de gestión de la calidad, al decir que un servicio de transporte se caracteriza por su intangibilidad?",
    "options": [
      "Que está sujeto a cambios impredecibles.",
      "Que no se puede medir con facilidad antes de prestarlo efectivamente.",
      "Que su valoración depende de cada cliente.",
      "Todas las respuestas son correctas."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 96,
    "prompt": "¿El personal al servicio de la Administración Pública puede ser vocal de las Juntas Arbitrales del Transporte?",
    "options": [
      "No, son funciones incompatibles.",
      "Sí, puede haber hasta cuatro vocales que sean empleados públicos.",
      "Sí, puede haber hasta dos vocales que sean empleados públicos.",
      "Sí, debe haber siempre al menos un vocal que sea empleado público."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 97,
    "prompt": "¿A quién se imputará la infracción por superar el tiempo máximo de conducción diaria, que a su vez represente una falta muy grave de indisciplina del conductor respecto de las instrucciones recibidas de la empresa, si este es objeto de una sanción disciplinaria por la misma consistente en postergación para ascensos en la empresa?",
    "options": [
      "Al conductor.",
      "A la empresa.",
      "A la empresa y al conductor a partes iguales.",
      "A nadie, dado que sería imputable al conductor, pero este ya ha sido sancionado por la empresa."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 98,
    "prompt": "La norma de que los conductores de vehículos de transporte de mercancías con MMA superior a 7,5 toneladas no pueden participar en las operaciones de carga del vehículo no se aplica en el caso de:",
    "options": [
      "transporte internacional.",
      "vehículos cisterna.",
      "vehículos articulados.",
      "trenes de carretera."
    ],
    "correctOption": "B",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 99,
    "prompt": "¿Está permitido que los conductores de vehículos de transporte de mercancías con MMA superior a 7,5 toneladas participen en las operaciones de carga y descarga en el caso de transportes de carga fraccionada entre un centro de distribución y el punto de venta?",
    "options": [
      "Sí, cuando dicha tarea no afecte a su descanso diario.",
      "Sí, siempre.",
      "Sí, cuando dicha actividad se efectúe en el marco de un contrato entre el cargador y el porteador de duración igual o superior a un año.",
      "Sí, cuando se cumplan simultáneamente las condiciones indicadas en las respuestas A y C."
    ],
    "correctOption": "D",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 100,
    "prompt": "¿Qué circunstancia de las siguientes puede suponer un incremento de consumo de un 2 %?",
    "options": [
      "Una presión de 2 bares por encima de la presión fijada por el fabricante del neumático.",
      "Una presión de 3 bares por encima de la presión fijada por el fabricante del neumático.",
      "Una presión de 2 bares por debajo de la presión fijada por el fabricante del neumático.",
      "Una presión de 3 bares por debajo de la presión fijada por el fabricante del neumático."
    ],
    "correctOption": "C",
    "isScored": true,
    "isReserve": false
  },
  {
    "number": 101,
    "prompt": "La sobrecarga de alguno de los ejes de un camión",
    "options": [
      "no puede dañar el eje de dirección.",
      "no puede dañar a los neumáticos.",
      "no afecta a la tracción.",
      "provoca efectos negativos en la conducción y seguridad del vehículo."
    ],
    "correctOption": "D",
    "isScored": false,
    "isReserve": true
  },
  {
    "number": 102,
    "prompt": "Cuando se adelante a un ciclista en una vía fuera de poblado, ¿qué se deberá tener en cuenta?",
    "options": [
      "Que hay que adelantar muy rápido para pasarlo lo antes posible.",
      "Que la separación lateral no debe ser inferior a 1,50 metros.",
      "Que la distancia lateral mínima debe ser de 5 metros.",
      "Que no se debe ocupar en parte o la totalidad del carril continuo de la calzada."
    ],
    "correctOption": "B",
    "isScored": false,
    "isReserve": true
  },
  {
    "number": 103,
    "prompt": "Si en un vehículo se detecta una manipulación del tacógrafo, pero no está funcionando en ese momento:",
    "options": [
      "no se considera infracción.",
      "se considera igualmente infracción.",
      "solo se considerará infracción si se ha alterado el interior del tacógrafo.",
      "solo se considerará infracción si el vehículo está matriculado en el país en el que se detecte la manipulación."
    ],
    "correctOption": "B",
    "isScored": false,
    "isReserve": true
  }
] as ExamQuestion[];

export const MERCANCIAS_EXAM_META = {
  id: "2026-09-26-mercancias",
  title: "Examen obtención del CAP Mercancías",
  subtitle: "Convocatoria 26/09/2026",
  totalQuestions: 103,
  scoredQuestions: 100,
  reserveQuestions: [101, 102, 103],
  source: "2026-09-26_MERCANCIAS_EXAMEN.pdf + 2026-09-26_MERCANCIAS_PLANTILLA.pdf",
} as const;
