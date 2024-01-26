import React from "react";
import {
    View,
    Image,
    TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import Constants from "../../common/Constants";

class AddImage extends React.Component {
    constructor(props) {
        super(props);

        this.id = props.imageId;

        this.state = {
            selected: false,
            animating: false,
            translateX: 0,
            translateY: 0,
            width: 0,
            height: 0,
            initialWidth: 0,
            initialHeight: 0,
            srcWidth: 0,
            srcHeight: 0,
            ratio: 0,
        };

        // PANNING
        this.panning = false;

        this.originPanningX = 0;
        this.originPanningY = 0;

        this.deltaPanningX = 0;
        this.deltaPanningY = 0;

        this.frictionX = 1.0;
        this.frictionY = 1.0;

        this.directionX = null;
        this.directionY = null;

        this.leftEdge = 0; // NEGATIVE VALUE
        this.rightEdge = 0;
        this.topEdge = 0; // NEGATIVE VALUE
        this.bottomEdge = 0;

        this.leftEdgeMax = 0;
        this.rightEdgeMax = 0;
        this.topEdgeMax = 0;
        this.bottomEdgeMax = 0;


        this.snapAnimation = null;

        // TRANSLATION
        this.originTranslateX = 0;
        this.originTranslateY = 0;

        // SCALING
        this.scaling = false;
        this.deltaScaling = 0;

        this.calculateImageSize();
    }

    componentDidUpdate(prevProps) {
        const {
            matrix,
            direction,
            boundaries,
            panningLeftPadding,
            panningRightPadding,
            panningTopPadding,
            panningBottomPadding,
        } = this.props;
        const { width, height } = this.state;

        this.leftEdge = 0;
        this.rightEdge = width - (boundaries.ux - boundaries.lx);
        this.topEdge = 0;
        this.bottomEdge = height - (boundaries.uy - boundaries.ly);

        this.leftEdgeMax = this.leftEdge - panningLeftPadding;
        this.rightEdgeMax = this.rightEdge + panningRightPadding;
        this.topEdgeMax = this.topEdge - panningTopPadding;
        this.bottomEdgeMax = this.bottomEdge + panningBottomPadding;

        // Auto resize collage images when matrix, direction, or collage size is updated
        if (matrix !== prevProps.matrix || direction !== prevProps.direction) {
            if (this.snapAnimation != null) {
                // INTERRUPT ANIMATION
                this.snapAnimation.stop();
                this.snapAnimation = null;
            }

            this.calculateImageSize();
        }
    }

    componentWillUnmount() {
        // Clear long press timer when component is unmounted
        if (this.onLongPressTimeout) clearTimeout(this.onLongPressTimeout);
    }

    calculateFriction(x, y) {
        let frictionX = 1.0;
        let frictionY = 1.0;

        if (x < this.leftEdge && this.directionX === "right") {
            // TOO FAR RIGHT
            frictionX = Math.max(
                0,
                (x - this.leftEdgeMax) / (this.leftEdge - this.leftEdgeMax)
            ); // REVERSE NORMALIZATION
        }

        if (x > this.rightEdge && this.directionX === "left") {
            // TOO FAR RIGHT
            frictionX = Math.max(
                0,
                (x - this.rightEdgeMax) / (this.rightEdge - this.rightEdgeMax)
            ); // REVERSE NORMALIZATION
        }

        if (y < this.topEdge && this.directionY === "down") {
            // TOO FAR DOWN
            frictionY = Math.max(
                0,
                (y - this.topEdgeMax) / (this.topEdge - this.topEdgeMax)
            ); // REVERSE NORMALIZATION
        }

        if (y > this.bottomEdge && this.directionY === "up") {
            // TOO FAR UP
            frictionY = Math.max(
                0,
                (y - this.bottomEdgeMax) / (this.bottomEdge - this.bottomEdgeMax)
            ); // REVERSE NORMALIZATION
        }

        return { frictionX, frictionY };
    }

    /**
     * Updates the image postion, will use animation to snap the image into place if it is out of bounds
     */
    calculateImagePosition() { }

    /**
     * Calculates the size of the image. This includes width, height, intial size and source size.
     *
     * @param targetWidth {number} target width to overwrite the width to be calculated
     * @param targetHeight {number} target height to overwite the height to be calculated
     * @param keepScale {bool} Keeps the scale of the image, does not try to adjust to container size
     */
    calculateImageSize(
        targetWidth = null,
        targetHeight = null,
        keepScale = false
    ) {

    }

    /**
     * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
     * images to fit into a certain area. We use Math.max becuase we don't want
     * the image to resize smaller than the container.
     *
     * @param {Number} srcWidth width of source image
     * @param {Number} srcHeight height of source image
     * @param {Number} maxWidth maximum available width
     * @param {Number} maxHeight maximum available height
     * @param {Bool} Keeps the scale of the image
     *
     * @return {Object} { imageWidth, imageHeight }
     */
    calculateAspectRatioFit(
        srcWidth,
        srcHeight,
        maxWidth,
        maxHeight,
        keepScale = false
    ) {
        const newMaxWidth = keepScale ? Math.max(srcWidth, maxWidth) : maxWidth;
        const newMaxHeight = keepScale ? Math.max(srcHeight, maxHeight) : maxHeight;

        const ratio = Math.max(newMaxWidth / srcWidth, newMaxHeight / srcHeight);
        return { imageWidth: srcWidth * ratio, imageHeight: srcHeight * ratio };
    }

    /**
     * Method triggered when image has been swapped
     *
     * @param image - A CollageImage class
     */
    imageSwapped(image) {
        const { retainScaleOnSwap } = this.props;

        // SWAP PROPERTIES
        let targetImagePanningX = image.state.panningX;
        let targetImagePanningY = image.state.panningY;
        const targetImageWidth = image.state.width;
        const targetImageHeight = image.state.height;

        if (targetImagePanningX < this.leftEdge) {
            targetImagePanningX = this.leftEdge;
        }
        if (targetImagePanningX > this.rightEdge) {
            targetImagePanningX = this.rightEdge;
        }
        if (targetImagePanningY < this.topEdge) {
            targetImagePanningY = this.topEdge;
        }
        if (targetImagePanningY > this.bottomEdge) {
            targetImagePanningY = this.bottomEdge;
        }

        // WHEN IMAGE IS SWAPPED THEN WE RECALCULATE THE SIZE.
        this.calculateImageSize(
            targetImageWidth,
            targetImageHeight,
            retainScaleOnSwap
        );

        this.setState({
            panningX: targetImagePanningX,
            panningY: targetImagePanningY,
        });
    }

    render() {
        const {
            imageContainerStyle,
        } = this.props;
        const {
            translateX,
            translateY,
        } = this.state;
        return (
            <TouchableOpacity
                ref={"imageContainer"}
                style={[
                    {
                        flex: 1,
                        overflow: "hidden",
                        transform: [
                            { translateX: -translateX },
                            { translateY: -translateY },
                        ],
                    },
                    imageContainerStyle,
                    { backgroundColor: Constants.COLOR.GRAY, alignItems: 'center', justifyContent: 'center' }
                ]}
                onPress={this.props.onAddPress} >
                <Image style={{ width: 36, height: 32, resizeMode: 'contain' }} source={require('../../../assets/images/ic_about_camera.png')} />
            </TouchableOpacity>
        );
    }
}

AddImage.propTypes = {
    panningLeftPadding: PropTypes.number.isRequired, // LEFT PANNING PADDING
    panningRightPadding: PropTypes.number.isRequired, // RIGHT PANNING PADDING
    panningTopPadding: PropTypes.number.isRequired, // TOP PANNING PADDING
    panningBottomPadding: PropTypes.number.isRequired, // BOTTOM PANNING PADDING
    scaleAmplifier: PropTypes.number.isRequired, // ADJUST SCALING
    retainScaleOnSwap: PropTypes.bool,
    longPressDelay: PropTypes.number,
    longPressSensitivity: PropTypes.number, // 1 - 20 - How sensitive is the long press?
    onEditButtonPress: PropTypes.func,
    EditButtonComponent: PropTypes.func,
    editButtonPosition: PropTypes.oneOf([
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
    ]),
    isEditButtonVisible: PropTypes.bool,
    editButtonIndent: PropTypes.number,
    imageContainerStyle: PropTypes.object,
    imageFocussedStyle: PropTypes.object,
    imageFocusId: PropTypes.string,
    onImageFocus: PropTypes.func,
};

export default AddImage;
