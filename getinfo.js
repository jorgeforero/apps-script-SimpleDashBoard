//
// DASHBOARD
// Funciones de gestión para de los datos a desplegar en el dashboard

/**
* getDashboardContent
* Obtiene y despliega la información de inicio del dashboard 
*
* @param {void} - 
* @return {sttring} - Cadena HTML con la información recolectada para el dashboard
**/
function getDashboardContent() {
  var tpl_hmdashboard = HtmlService.createHtmlOutputFromFile('tpl_displaydata.html').getContent();
  var dsbData = getDashboardData();
  // Datos de totales 
  tpl_hmdashboard = tpl_hmdashboard.replace('##TOTALATHLETES##', dsbData.athtotal);
  tpl_hmdashboard = tpl_hmdashboard.replace('##TOTALACTIVE##', dsbData.athacttotal);
  tpl_hmdashboard = tpl_hmdashboard.replace('##TOTALPLANS##', dsbData.plntotal);
  tpl_hmdashboard = tpl_hmdashboard.replace('##TOTALFEEDS##', dsbData.fbktotal);
  // Porcentajes
  tpl_hmdashboard = tpl_hmdashboard.replace(/##MENPRCTG##/g, dsbData.menpercent);
  tpl_hmdashboard = tpl_hmdashboard.replace(/##WOMENPRCTG##/g, dsbData.womenpercent);
  tpl_hmdashboard = tpl_hmdashboard.replace(/##DAILLYPRCTG##/g, dsbData.dailypercent);
  tpl_hmdashboard = tpl_hmdashboard.replace(/##ZONESPRCTG##/g, dsbData.zonespercent);
  return tpl_hmdashboard;
};

/**
* getDashboardData
* Obtiene los datos a desplegar en el dashboard y retorna un objeto con la información objetida
*
* @param {object} Cache - Objeto con la definición de cache para la función (ON/OFF, time)
* @return {object} - Objeto con los valores obtenidos
*   athTotal: Total de atletas registrados en EAD
*   athActTotal: Total de atletas activos
*   plnTotal: Total de grupos/planes definidos
*   fbkTotal: Total del feeds pendientes en EAD
*   menPercent: Porcentaje de atletas hombres
*   womenPercent: Porcentaje de atletas mujeres,
*   dailyPercent: Porcentaje de atletas con envío diario definido
*   zonesPercent: Porcentaje de atletas con zonas definidas
*   birthsList: Lista de cumpleañeros para el mes actual
**/
function getDashboardData() {
  // Proceso para obtener los datos del Dashboard
  var athletesBox = SpreadsheetApp.openById(ID_WS_SCHEMA).getSheetByName('People').getDataRange().getValues();
  var athleteLabels = athletesBox.shift();
  var active = 0;
  var feeds = 0;
  var withZone = 0;
  var withDaily = 0;
  var men = 0;
  var women = 0;
  // Recorre Athlete List para recolectar los datos
  for (var index=0; index<athletesBox.length; index++) {
    var athlete = getObjectRecord(athleteLabels, athletesBox[index]);
    if (athlete.active == true) active++;
    if (athlete.zona1 != '') withZone++;
    if (athlete.frequency == 2) withDaily++;
    if (athlete.sex == 'H') men++; else women++;
    if (athlete.feeds != 0) feeds++
  };//for

  // Genera el objeto de los datos
  var dsbData = {athtotal: athletesBox.length,
                 athacttotal: active,
                 plntotal: 3,
                 fbktotal: feeds,
                 menpercent: (athletesBox.length > 0) ? parseFloat(Math.round(men * 100) / athletesBox.length).toFixed(1) : 0, // Porcentaje hombres
                 womenpercent: (athletesBox.length > 0) ? parseFloat(Math.round(women * 100) / athletesBox.length).toFixed(1) : 0, // Porcentaje mujeres,
                 dailypercent: (athletesBox.length > 0) ? parseFloat(Math.round(withDaily * 100) / athletesBox.length).toFixed(1) : 0, // Porcentaje envío diario
                 zonespercent: (athletesBox.length > 0) ? parseFloat(Math.round(withZone * 100) / athletesBox.length).toFixed(1) : 0 // Porcentaje con zonas
                 };
  // Retorna la lista generada
  return dsbData; 
};

/**
* getObjectRecord
* Convierte un arreglo tipo record en una arreglo para referencia por nombres de características
*
* @param {array} Labels Arreglo unidimensional que contiene los titulos del dataBox
* @param {arrar} Record Arreglo unidimensional que coniiene los valores del registro en proceso
* @return {object} - Objeto con los datos del registro
* Importante: Acepta mayusculas en los nombres de las propiedades
**/
function getObjectRecord(Labels, Record) {
  var resObj = {}; 
  // carga los valores en un objeto para facilitar la referenciación
  for (var index=0; index<Record.length; index++) {
    // resObj[Labels[index]] = Record[index]
    // Soportar que el nombre de la propiedad venga con espacios
    resObj[Labels[index].toLowerCase().replace(/\s/g, '_')] = Record[index];
  };
  return resObj
};
