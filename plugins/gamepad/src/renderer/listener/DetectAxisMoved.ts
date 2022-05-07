const axisMovementThreshold = 0.1;

type axisValueType = {
    [key: number]: number
}
type axisValues = {
    [key: string]: axisValueType
}

let axisValues = {} as axisValues;

export function DetectAxisMoved(gamepad: Gamepad){
    gamepad.axes.forEach((axis, index) => {
        if(axisValues[gamepad.id] == undefined) {
            axisValues[gamepad.id] = {};
            if (axisValues[gamepad.id][index] == undefined) {
                axisValues[gamepad.id][index] = axis;
            }
        }

        if (Math.abs(axis) > axisMovementThreshold && axis != 0) {
            axisValues[gamepad.id][index] = axis;
            sendAxisMovedEvent(gamepad, index, axis);
        }else{
            if(axisValues[gamepad.id][index] != 0){
                axisValues[gamepad.id][index] = 0;
                sendAxisMovedEvent(gamepad, index, 0);
            }
        }
    });
}

const sendAxisMovedEvent = (gamepad: Gamepad, index: number, value: number) => {
    const totalAxisIndexes = gamepad.axes.length;
    const totalSticks = totalAxisIndexes / 2;

    let stick;
    let position;
    let axisMovementValue = value;
    let axisName;

    if (index < totalSticks) {
        stick = 'left';
    } else {
        stick = 'right';
    }

    if (index === 0 || index === 2) {
        axisName = 'x';
        position = value == 0 ? 'center' : value < 0 ? 'left' : 'right';
    }
    if (index === 1 || index === 3) {
        axisName = 'y';
        position = value == 0 ? 'center' : value < 0 ? 'top' : 'bottom';
    }

    if(axisName == 'y'){
        axisMovementValue = axisMovementValue * -1
    }

    const buttonReleaseEvent = new CustomEvent('gamepad_axis_move', {
        detail: {
            gamepad,
            stick,
            axisName,
            totalSticks,
            position,
            axisMovementValue,
            axis: index
        }
    });
    window.dispatchEvent(buttonReleaseEvent);
}