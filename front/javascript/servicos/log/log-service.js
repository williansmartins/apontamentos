angular
.module('controlei')
.factory('LogService', LogService);

function LogService ($log) {
    var normalLogger = $log.getInstance('Normal');

    //Examples call
    // LogService.debug("minha mensagem");
    // LogService.info("minha mensagem");
    // LogService.error("minha mensagem");
    // LogService.warn("minha mensagem");
    // LogService.log("minha mensagem");

    // para mudar o nivel de log
    // var mutedLogger = $log.getInstance('Muted');
    // $log.logLevels['Muted'] = $log.LEVEL.OFF;
	
	return {
		info : function (mensagem) {
			normalLogger.info(mensagem);
		},
		error : function (mensagem) {
			normalLogger.error(mensagem);
		},
		log : function (mensagem) {
			normalLogger.log(mensagem);
		},
		debug : function (mensagem) {
			normalLogger.debug(mensagem);
		},
		warn : function (mensagem) {
			normalLogger.warn(mensagem);
		},
	};
}