import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({scope: Scope.TRANSIENT})
export class LoggerService extends ConsoleLogger {
    read(options: any, serviceType: string){
        this.log(`Finding ${serviceType} information, id: ${options.id}`)
    }
}
