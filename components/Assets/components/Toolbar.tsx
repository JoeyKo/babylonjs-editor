import { Flex, HStack, IconButton, Input, InputGroup, InputLeftElement, Select, Spacer } from "@chakra-ui/react";
import { MdAdd, MdUpload } from "react-icons/md";
import { BsMagic } from "react-icons/bs";
import { SearchIcon } from "@chakra-ui/icons";
import { useRef } from "react";

export default function AssetsToolbar({
  onUpload
}: {
  onUpload: (files: File[]) => void
}) {
  const assetFileUploadRef = useRef<HTMLInputElement>(null);

  function openUpload() {
    assetFileUploadRef.current?.click();
  }

  function onFilesChange(e: any) {
    const files = e.target.files;
    onUpload([...files])
  }

  return (
    <Flex>
      <HStack>
        <Select size='xs' variant="filled" placeholder='所有'>
          <option value='model'>模型</option>
          <option value='material'>材质</option>
          <option value='texutre'>贴图</option>
        </Select>
        <InputGroup size="xs">
          <InputLeftElement
            pointerEvents='none'
            // eslint-disable-next-line react/no-children-prop
            children={<SearchIcon />}
          />
          <Input placeholder='搜索名称' />
        </InputGroup>
      </HStack>
      <Spacer />
      <HStack>
        <label>
          <input multiple type="file" ref={assetFileUploadRef} onChange={onFilesChange} />
          <IconButton onClick={openUpload} size='xs' fontSize={"sm"} icon={<MdUpload />} aria-label={"上传"} />
        </label>
        <IconButton size="xs" fontSize={"md"} icon={<MdAdd />} aria-label={"创建"} />
        <IconButton size='xs' fontSize={"sm"} icon={<BsMagic />} aria-label={"资源库"} />
      </HStack>
    </Flex>
  )
}