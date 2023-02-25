
import * as React from "react";
import { Box, Collapse, Fade, Heading, HStack, Icon, Stack } from "@chakra-ui/react";
import { Nullable } from "@/lib/types";
import InspectorUtils from "../utils";
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io'

export interface IInspectorSectionProps {
  /**
   * Defines the title of the section shown as a header.
   */
  title: string;

  children?: React.ReactNode;
  /**
   * Defines the optional icon of the section.
   */
  icon?: React.ReactNode;
  /**
   * Defines wether or not the section is collapsed.
   */
  collapsed?: boolean;
}

export interface IInspectorSectionState {
  /**
   * Defines the current height of the callout.
   */
  collapsed: boolean;
}

export class InspectorSection extends React.Component<IInspectorSectionProps, IInspectorSectionState> {
  private _inspectorName: Nullable<string> = null;

  /**
   * Constructor.
   * @param props defines the component's props.
   */
  public constructor(props: IInspectorSectionProps) {
    super(props);

    this.state = {
      collapsed: props.collapsed ?? false,
    };
  }

  /**
   * Renders the component.
   */
  public render(): React.ReactNode {
    // Add dividers
    let children = this.props.children as React.ReactNode[] ?? [];
    if (children && !Array.isArray(children)) {
      children = [children];
    }

    return (
      <Box>
        <HStack
          cursor="pointer"
          py={1.5}
          px={2}
          bg="gray.800"
          color="gray.100"
          onClick={() => this._handleCollapse()}>
          <Icon fontSize={"sm"} as={this.state.collapsed ? IoIosArrowForward : IoIosArrowDown} />
          <Heading
            as="h4"
            fontSize="sm"
          >
            {this.props.title}
          </Heading>
        </HStack>
        <Fade in={!this.state.collapsed}>
          <Stack pt={1.5} spacing={1.5} px={2}>{children}</Stack>
        </Fade>
      </Box>
    );
  }

  /**
   * Called on the component did mount.
   */
  public componentDidMount(): void {
    this._inspectorName = InspectorUtils.CurrentInspectorName;

    this.setState({
      collapsed: InspectorUtils.IsSectionCollapsed(this.props.title),
    });
  }

  /**
   * Called on the user wants to collapse.
   */
  private _handleCollapse(): void {
    this.setState({ collapsed: !this.state.collapsed });

    InspectorUtils.SetSectionCollapsed(this.props.title, !this.state.collapsed, this._inspectorName);
  }
}
