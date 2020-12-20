//% color="#EDC857" weight=100 icon="\uf11b" block="Controller"
//% groups=['Motors']
namespace controller {
    //% fixedInstances
    export class MicroMotor {
        private forwardsOn: boolean;
        private backwardsOn: boolean;

        constructor(private p1: DigitalPin, private p2: DigitalPin) {
        }

        //% blockId=micromotor_setforwards block="%motor forwards %on"
        //% group="Motors"
        setForwards(on: boolean): void {
            this.forwardsOn = on;
            this.setMotorPins();
        }

        //% blockId=micromotor_setbackwards block="%motor backwards %on"
        //% group="Motors"
        setBackwards(on: boolean): void {
            this.backwardsOn = on;
            this.setMotorPins();
        }

        private setMotorPins() {
            pins.digitalWritePin(this.p1, this.forwardsOn ? 1 : 0);
            pins.digitalWritePin(this.p2, this.backwardsOn ? 1 : 0);
        }
    }

    //% fixedInstance block="M1" blockId=micromotor_m1
    export const M1 = new MicroMotor(DigitalPin.P12, DigitalPin.P13);
    //% fixedInstance block="M2" blockId=micromotor_m2
    export const M2 = new MicroMotor(DigitalPin.P14, DigitalPin.P15);
}
