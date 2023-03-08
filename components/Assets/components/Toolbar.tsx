import { Flex, HStack, IconButton, Input, InputGroup, InputLeftElement, Select, Spacer } from "@chakra-ui/react";
import { MdAdd, MdUpload } from "react-icons/md";
import { BsMagic, BsUpload } from "react-icons/bs";
import { SearchIcon } from "@chakra-ui/icons";

export default function AssetsToolbar() {
  return (
    <Flex>
      <HStack>
        <Select size='xs' variant="filled" placeholder='所有'>
          <option value='model'>模型</option>
          <option value='material'>材质</option>
          <option value='texutre'>贴图</option>
          <option value='particle-system'>粒子</option>
          <option value='animation'>动画</option>
          <option value='script'>脚本</option>
        </Select>
        <InputGroup size="xs">
          <InputLeftElement
            pointerEvents='none'
            // eslint-disable-next-line react/no-children-prop
            children={<SearchIcon />}
          />
          <Input placeholder='搜索名称' variant="filled" />
        </InputGroup>
      </HStack>
      <Spacer />
      <HStack>
        <IconButton size='xs' fontSize={"sm"} icon={<MdUpload />} aria-label={"上传"} />
        <IconButton size="xs" fontSize={"md"} icon={<MdAdd />} aria-label={"创建"} />
        <IconButton size='xs' fontSize={"sm"} icon={<BsMagic />} aria-label={"资源库"} />
      </HStack>
    </Flex>
  )
}