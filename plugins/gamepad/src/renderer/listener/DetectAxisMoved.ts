const axisMovementThreshold = 0.1;

export function DetectAxisMoved(gamepad: Gamepad){
    const totalAxisIndexes = gamepad.axes.length;
    const totalSticks = totalAxisIndexes / 2;

    gamepad.axes.forEach((axis, index) => {
        if (Math.abs(axis) > axisMovementThreshold) {
            let stickMoved = null;
            let directionOfMovement = null;
            let axisMovementValue = axis;

            if (index < totalSticks) {
                stickMoved = 'left_stick';
            } else {
                stickMoved = 'right_stick';
            }

            if (index === 0 || index === 2) {
                directionOfMovement = axis < 0 ? 'left' : 'right';
            }
            if (index === 1 || index === 3) {
                directionOfMovement = axis < 0 ? 'top' : 'bottom';
            }

            const buttonReleaseEvent = new CustomEvent('gamepad_axis_move', {
                detail: {
                    gamepad,
                    totalSticks,
                    stickMoved,
                    directionOfMovement,
                    axisMovementValue,
                    axis: index
                }
            });
            window.dispatchEvent(buttonReleaseEvent);
        }
    });
}