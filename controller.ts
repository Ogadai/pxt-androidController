enum acBtn {
    //% block="DPad Up"
    DUp,
    //% block="DPad Down"
    DDown,
    //% block="DPad Left"
    DLeft,
    //% block="DPad Right"
    DRight,
    //% block="DPad Up or Down"
    DUpDown,
    //% block="DPad Left or Right"
    DLeftRight,
    //% block="DPad Any"
    DPad,
    //% block="XBox Y"
    XY,
    //% block="XBox X"
    XX,
    //% block="XBox A"
    XA,
    //% block="XBox B"
    XB,
    //% block="XBox X or Y"
    XXY,
    //% block="XBox A or B"
    XAB,
    //% block="ABox Any"
    XBox,
    //% block="Steering"
    Steer
}

//% color="#EDC857" weight=50 icon="\uf11b"
namespace Controller {
    const _state: any = {};
    const _onPress: any = {};
    const _onChange: any = {};

    //% blockId=acOnPressed block="on %button pressed"
    export function onPressed(btn: acBtn, handler: () => void): void {
        _onPress[btn] = handler;
    }

    //% blockId=acOnChange block="on %button change"
    export function onChange(btn: acBtn, handler: () => void): void {
        _onChange[btn] = handler;
    }

    //% blockId=acPressed block="%button pressed"
    export function pressed(btn: acBtn): boolean {
        return _state[btn] !== 1;
    }

    //% blockId=acValue block="%button value"
    export function value(btn: acBtn): number {
        return _state[btn];
    }

    function doBtn(btn: acBtn, pressed: boolean): void {
        if (doValue(btn, pressed ? 1 : 0)) {
            if (pressed && _onPress[btn]) _onPress[btn]();
        }
    }

    function doValue(btn: acBtn, value: number): boolean {
        if (_state[btn] !== value) {
            _state[btn] = value;
            if (_onChange[btn]) _onChange[btn]();
            return true;
        }
        return false;
    }

    control.onEvent(1026, EventBusValue.MICROBIT_EVT_ANY, function () {
        const ev = control.eventValue();
        doBtn(acBtn.DRight, ev === 2);
        doBtn(acBtn.DLeft, ev === 1);
        doBtn(acBtn.DLeftRight, ev !== 0);
        doBtn(acBtn.DPad, ev !== 0 || _state[acBtn.DUpDown] );
    });

    control.onEvent(1027, EventBusValue.MICROBIT_EVT_ANY, function () {
        const ev = control.eventValue();
        doBtn(acBtn.DUp, ev === 2);
        doBtn(acBtn.DDown, ev === 1);
        doBtn(acBtn.DUpDown, ev !== 0);
        doBtn(acBtn.DPad, ev !== 0 || _state[acBtn.DLeftRight] );
    });

    control.onEvent(1028, EventBusValue.MICROBIT_EVT_ANY, function () {
        doValue(acBtn.Steer, (control.eventValue() - 100) * 0.9);
    });

    function isSet (value: number, checkValue: number): boolean {
        return Math.floor(value / checkValue / 2) * 2 != Math.floor(value / checkValue)
    }

    control.onEvent(1029, EventBusValue.MICROBIT_EVT_ANY, function () {
        const value = control.eventValue();

        doBtn(acBtn.XX, isSet(value, 1));
        doBtn(acBtn.XY, isSet(value, 2));
        doBtn(acBtn.XA, isSet(value, 4));
        doBtn(acBtn.XB, isSet(value, 8));

        doBtn(acBtn.XXY, _state[acBtn.XX] || _state[acBtn.XY]);
        doBtn(acBtn.XAB, _state[acBtn.XA] || _state[acBtn.XB]);
        doBtn(acBtn.XBox, value !== 0);
    });
}
