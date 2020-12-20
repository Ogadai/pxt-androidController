//% color="#EDC857" weight=100 icon="\uf11b" block="Controller"
//% groups=['Tilt']
namespace controller {
    //% fixedInstances
    export class Button {
        private isOn: boolean;
        private changeHandler: () => void;
        private pressedHandler: () => void;

        //% blockId=controller_button_on_change block="on %button change"
        onChange(handler: () => void) {
            this.changeHandler = handler;
        }

        //% blockId=controller_button_on_pressed block="on %button pressed"
        onPressed(handler: () => void) {
            this.pressedHandler = handler;
        }

        //% blockId=controller_button_pressed block="%button pressed"
        get pressed(): boolean {
            return this.isOn;
        }

        //% blockId=controller_button_value block="%button value"
        get value(): number {
            return this.isOn ? 1 : 0;
        }

        setPressed(on: boolean): boolean {
            if (this.isOn !== on) {
                this.isOn = on;
                if (this.changeHandler) this.changeHandler();

                if (this.isOn && this.pressedHandler) {
                    this.pressedHandler();
                }
                return true;
            }
            return false;
        }
    }

    //% fixedInstances
    export class Pair {
        private changeHandler: () => void;

        //% blockId=controller_pair_on_change block="pair %button change"
        onChange(handler: () => void) {
            this.changeHandler = handler;
        }

        changed() {
            if (this.changeHandler) {
                this.changeHandler();
            }
        }
    }

    //% fixedInstances
    export class Tilt {
        private tiltAngle: number;
        private handler: () => void;

        //% blockId=controller_tilt_on_change block="on %button change"
        //% group="Tilt"
        onChange(handler: () => void) {
            this.handler = handler;
        }

        //% blockId=controller_title_angle block="%tilt angle"
        //% group="Tilt"
        get angle(): number {
            return this.tiltAngle;
        } 

        setAngle(angle: number): void {
            this.tiltAngle = angle;
            if (this.handler) this.handler();
        }
    }    

    //% fixedInstance block="dPadUp" blockId=controller_dpadup
    export const dPadUp = new Button();
    //% fixedInstance block="dPadDown" blockId=controller_dpaddown
    export const dPadDown = new Button();
    //% fixedInstance block="dPadLeft" blockId=controller_dpadleft
    export const dPadLeft = new Button();
    //% fixedInstance block="dPadRight" blockId=controller_dpadright
    export const dPadRight = new Button();

    //% fixedInstance block="dPadUpDown" blockId=controller_dpadupdown
    export const dPadUpDown = new Pair();
    //% fixedInstance block="dPadLeftRight" blockId=controller_dpadleftright
    export const dPadLeftRight = new Pair();

    //% fixedInstance block="steering"
    export const steering = new Tilt();

    //% fixedInstance block="xBoxA" blockId=controller_xboxa
    export const xBoxA = new Button();
    //% fixedInstance block="xBoxB" blockId=controller_xboxb
    export const xBoxB = new Button();
    //% fixedInstance block="xBoxX" blockId=controller_xboxx
    export const xBoxX = new Button();
    //% fixedInstance block="xBoxY" blockId=controller_xboxy
    export const xBoxY = new Button();

    //% fixedInstance block="xboxAB" blockId=controller_xboxab
    export const xboxAB = new Pair();
    //% fixedInstance block="xboxXY" blockId=controller_xboxxy
    export const xboxXY = new Pair();

    control.onEvent(1026, EventBusValue.MICROBIT_EVT_ANY, function () {
        dPadRight.setPressed(control.eventValue() == 2);
        dPadLeft.setPressed(control.eventValue() == 1);
        dPadLeftRight.changed();
    });

    control.onEvent(1027, EventBusValue.MICROBIT_EVT_ANY, function () {
        dPadUp.setPressed(control.eventValue() == 2);
        dPadDown.setPressed(control.eventValue() == 1);
        dPadUpDown.changed();
    });

    control.onEvent(1028, EventBusValue.MICROBIT_EVT_ANY, function () {
        steering.setAngle((control.eventValue() - 100) * 0.9);
    });

    function isSet (inputValue: number, checkValue: number) {
        return Math.floor(inputValue / checkValue / 2) * 2 != Math.floor(inputValue / checkValue)
    }

    control.onEvent(1029, EventBusValue.MICROBIT_EVT_ANY, function () {
        const value = control.eventValue();
        if (xBoxX.setPressed(isSet(value, 1)) || xBoxY.setPressed(isSet(value, 2))) {
            xboxXY.changed();
        }
        if (xBoxA.setPressed(isSet(value, 4)) || xBoxB.setPressed(isSet(value, 8))) {
            xboxAB.changed();
        }
    });
}
