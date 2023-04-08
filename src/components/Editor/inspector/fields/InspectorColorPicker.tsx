
import { Color3, Color4, Nullable } from "@babylonjs/core";
import { HStack, Text, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Box, Heading } from "@chakra-ui/react";
import * as React from "react";
import { HexColorPicker, HexAlphaColorPicker } from "react-colorful";
import InspectorUtils from "../utils";

export interface IColor4Like {
  /**
   * Defines the red component (between 0 and 1, default is 0)
   */
  r: number;
  /**
   * Defines the green component (between 0 and 1, default is 0)
   */
  g: number;
  /**
   * Defines the blue component (between 0 and 1, default is 0)
   */
  b: number;
  /**
   * Defines the alpha component (between 0 and 1, default is 1)
   */
  a: number;
}

export interface IInspectorColorPickerProps {
  /**
   * Defines the reference to the object to modify.
   */
  object: any;
  /**
   * Defines the property to edit in the object.
   */
  property: string;
  /**
   * Defines the label of the field.
   */
  label: string;
  /**
   * Defines the optional callback called on the value changes.
   * @param value defines the new value of the object's property.
   */
  onChange?: (value: Color3 | Color4) => void;
  /**
   * Defines the optional callack called on the value finished changes.
   * @param value defines the new value of the object's property.
   */
  onFinishChange?: (value: Color3 | Color4) => void;
}

export interface IInspectorColorPickerState {
  /**
   * Defines the current value of the input.
   */
  value: Color3 | Color4;

  isColor4: boolean;
  /**
   * Defines the color in hexadecimal way.
   */
  hex: string;
  /**
   * Defines the color of the hex string.
   */
  textColor: string;
}

export class InspectorColorPicker extends React.Component<IInspectorColorPickerProps, IInspectorColorPickerState> {
  private _inspectorName: Nullable<string> = null;
  private _initialValue: Color3 | Color4;

  /**
   * Constructor.
   * @param props defines the component's props.
   */
  public constructor(props: IInspectorColorPickerProps) {
    super(props);

    const value = props.object[props.property] as Color3 | Color4;
    if (value.r === undefined || value.g === undefined || value.b === undefined) {
      throw new Error("Only Color4 (r, g, b, a?) are supported for InspectorColorPicker.");
    }

    this._initialValue = value.clone();

    this.state = {
      value,
      isColor4: value instanceof Color4,
      hex: value.toHexString(false).toLowerCase(),
      textColor: this._getTextColor(this._getHSVFromColor(value)),
    };
  }

  /**
   * Renders the component.
   */
  public render(): React.ReactNode {
    return (
      <HStack spacing={2}>
        <Text w="25%" noOfLines={1} as="p" fontSize="xs">{this.props.label}</Text>
        <Box flex={1}>
          <Popover isLazy placement='top-start'>
            <PopoverTrigger>
              <Box
                w="100%"
                h="24px"
                bg={this.state.hex}
                cursor="pointer"
              >
                <Heading
                  as="h5"
                  fontSize="xs"
                  textAlign={"center"}
                  lineHeight="24px"
                  color={this.state.textColor}
                >
                  {this.state.hex}
                </Heading>
              </Box>
            </PopoverTrigger>
            <PopoverContent w="auto">
              <PopoverBody p={0} borderRadius={"8px"}>
                {this.state.isColor4 ?
                  <HexAlphaColorPicker color={this.state.hex}
                    onChange={color => this._handleColorChange(color)} />
                  : <HexColorPicker color={this.state.hex}
                    onChange={color => this._handleColorChange(color)} />}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      </HStack>
    );
  }

  /**
   * Called on the component did mount.
   */
  public componentDidMount(): void {
    this._inspectorName = InspectorUtils.CurrentInspectorName;
  }

  /**
   * Called on the component will unmount.
   */
  public componentWillUnmount(): void {
  }

  /**
   * Called on the color changed.
   */
  private _handleColorChange(color: string): void {
    this.setState({ hex: color, });

    if (this.state.isColor4) {
      this.setState({ textColor: this._getTextColor(this._getHSVFromColor(Color4.FromHexString(color))) })
      this.props.object[this.props.property] = Color4.FromHexString(color);
    } else {
      this.setState({ textColor: this._getTextColor(this._getHSVFromColor(Color3.FromHexString(color))) })
      this.props.object[this.props.property] = Color3.FromHexString(color);
    }

    this.props.onChange?.(this.props.object);
  }


  /**
   * Updates the state according to the current color value.
   */
  private _updateColorState(): void {
    const value = this.props.object[this.props.property];
    this.setState({
      value,
      hex: this.props.object[this.props.property].toHexString(),
      textColor: this._getTextColor(this._getHSVFromColor(value)),
    });
  }

  /**
   * Returns the text color according to the current HSV values.
   */
  private _getTextColor(hsvColor: Color3): string {
    return (hsvColor.b < 0.5 || hsvColor.g > 0.5) ? "white" : "black";
  }

  /**
   * Returns the given color as HSV color.
   * Returns a new reference of Color3.
   */
  private _getHSVFromColor(color: Color3 | Color4): Color3 {
    const color3 = new Color3(color.r, color.g, color.b);
    return color3.toHSV();
  }
}
