import React, { useContext, useImperativeHandle } from "react";
import { DraggableModal, DraggableModalProps, DraggableModalContext } from "ant-design-draggable-modal";
import { useUID } from 'react-uid';
import { ModalID, ModalsState, ModalState } from "ant-design-draggable-modal/dist/draggableModalReducer";

export const initialModalState: ModalState = {
    x: 0,
    y: 0,
    width: 800,
    height: 800,
    zIndex: 0,
    visible: false,
}

const getInitialModalState = ({
    initialWidth = initialModalState.width,
    initialHeight = initialModalState.height,
    initialX = initialModalState.x,
    initialY = initialModalState.y,
}: {
    initialWidth?: number
    initialHeight?: number
    initialX?: number
    initialY?: number
}) => {
    return {
        ...initialModalState,
        width: initialWidth,
        height: initialHeight,
        x: initialX,
        y: initialY,
    }
}

const getModalState = ({
    state,
    id,
    initialWidth,
    initialHeight,
    initialX,
    initialY,
}: {
    state: ModalsState
    id: ModalID
    initialWidth?: number
    initialHeight?: number
    initialX?: number
    initialY?: number
}): ModalState => state.modals[id] || getInitialModalState({ initialWidth, initialHeight, initialX, initialY })

const Modal: React.FunctionComponent<DraggableModalProps & { id: ModalID, modalState: ModalState, dispatch: Function }> = DraggableModal;

export type ControllableModalRef = {
    move  : ( x: number, y: number ) => void,
    resize: ( x: number, y: number, width: number, height: number ) => void,
    width : number,
    height: number,
    x     : number,
    y     : number,
}

export type ControlltableModalProps = DraggableModalProps & {
    children?: React.ReactNode,
    initialX?: number;
    initialY?: number;
};

export const ControllableModal = React.forwardRef<ControllableModalRef, ControlltableModalProps>( function( props: ControlltableModalProps, ref ) {
    const id = useUID();

    const modalProvider = useContext( DraggableModalContext );
    if ( !modalProvider )
        throw new Error( 'No Provider' );

    const { dispatch, state } = modalProvider;
    const modalState = getModalState( {
        state,
        id,
        initialHeight: props.initialHeight,
        initialWidth: props.initialWidth,
        initialX: props.initialX,
        initialY: props.initialY,
    } );

    useImperativeHandle( ref, () => ( {
        move  : ( x: number, y: number ) => dispatch( { type: 'drag', id, x, y } ),
        resize: ( x: number, y: number, width: number, height: number ) => dispatch( { type: 'resize', id, x, y, width, height } ),
        width : modalState.width,
        height: modalState.height,
        x     : modalState.x,
        y     : modalState.y,
    } ), [ dispatch, id, modalState.width, modalState.height, modalState.x, modalState.y ] );
    

    return <Modal
        {...props}
        id={id}
        modalState={modalState}
        dispatch={dispatch}
    />;
} );