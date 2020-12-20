//% color="#EDC857" weight=100 icon="\uf11b" block="Controller"
//% groups=['Tilt']
namespace controller {
    //% fixedInstances
    export class ControllerButton {
        private isPressed: boolean;
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
            return this.isPressed;
        }

        //% blockId=controller_button_value block="%button value"
        get value(): number {
            return this.isPressed ? 1 : 0;
        }

        setPressed(pressed: boolean): boolean {
            if (this.isPressed !== pressed) {
                this.isPressed = pressed;
                if (this.changeHandler) this.changeHandler();

                if (this.isPressed && this.pressedHandler) {
                    this.pressedHandler();
                }
                return true;
            }
            return false;
        }
    }

    //% fixedInstances
    export class ControllerPair {
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
    export class ControllerTilt {
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
    export const dPadUp = new ControllerButton();
    //% fixedInstance block="dPadDown" blockId=controller_dpaddown
    export const dPadDown = new ControllerButton();
    //% fixedInstance block="dPadLeft" blockId=controller_dpadleft
    export const dPadLeft = new ControllerButton();
    //% fixedInstance block="dPadRight" blockId=controller_dpadright
    export const dPadRight = new ControllerButton();

    //% fixedInstance block="dPadUpDown" blockId=controller_dpadupdown
    export const dPadUpDown = new ControllerPair();
    //% fixedInstance block="dPadLeftRight" blockId=controller_dpadleftright
    export const dPadLeftRight = new ControllerPair();

    //% fixedInstance block="steering"
    export const steering = new ControllerTilt();

    //% fixedInstance block="xBoxA" blockId=controller_xboxa
    export const xBoxA = new ControllerButton();
    //% fixedInstance block="xBoxB" blockId=controller_xboxb
    export const xBoxB = new ControllerButton();
    //% fixedInstance block="xBoxX" blockId=controller_xboxx
    export const xBoxX = new ControllerButton();
    //% fixedInstance block="xBoxY" blockId=controller_xboxy
    export const xBoxY = new ControllerButton();

    //% fixedInstance block="xboxAB" blockId=controller_xboxab
    export const xboxAB = new ControllerPair();
    //% fixedInstance block="xboxXY" blockId=controller_xboxxy
    export const xboxXY = new ControllerPair();

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
