// Simple DashBoard
//

// Id Spreadsheet source data
var ID_WS_SCHEMA = 'XXX-INSERT-SPREADSHEET-ID-XXX';

/** 
* doGet
* Despliega el panel 
**/
function doGet(e) {
  // Opciones que vienen en el querystring
  var option = e.parameter.o;
  
  var active = true;

  // Habilita / Deshabilita la entrada al panel - Console key
  if (active) {
    // Template del panel
    var outputPanel = HtmlService.createHtmlOutputFromFile('tpl_cp.html').getContent();
    var contentPage = '';
    var scripts = '';
    // GraphLib
    var graphLib = '';
    // Determinación de la acción a desplegar
    if ((option == null) || (option == undefined)) option = '0';
    switch (option) {
      case '0': // Dashboard
        contentPage = getDashboardContent();
        break;  
      default:
        // Opcion no definida
    };
    // Reemplazables
    outputPanel = outputPanel.replace('##AVATAR##', 'https://cdn.iconscout.com/icon/free/png-512/laptop-user-1-1179329.png');
    outputPanel = outputPanel.replace('##COMPANY##', 'COMPANY');
    outputPanel = outputPanel.replace('##USER##', 'User');
    outputPanel = outputPanel.replace('##CONTENTPAGE##', contentPage);
    outputPanel = outputPanel.replace('##SCRIPTS##', scripts);
    outputPanel = outputPanel.replace('##GRAPHLIB##', graphLib);
    // Reemplazo global con la pagina armada
    outputPanel = outputPanel.replace(/##URLCP##/g, ScriptApp.getService().getUrl());
    outputPanel = outputPanel.replace(/##O##/g, option);
  } else {
    outputPanel = '<h5>ESTAMOS REALIZANDO MANTENIMIENTO AL SISTEMA!' 
                + '<br />Por esta razón el panel ha sido deshabilitado. Para información contacte al administrador</h5></center>';
  };
  // Despliegue del panel
  return HtmlService
    .createHtmlOutput(outputPanel)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle('Simple Dashboard');
};
