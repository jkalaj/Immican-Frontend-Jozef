import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(
  () => import("react-quill"),
  {
    ssr: false
  }
)
const TextEditor = (props) => {
  const [htmlContent, setHtmlContent] = useState(props.value);

  const handleChange = (value) => {
    setHtmlContent(value);
    props.sendValue(value)
  };


  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];
  return (
    <ReactQuill
      value={htmlContent}
      modules={modules}
      formats={formats}
      onChange={handleChange}
    />
  );
};

export default TextEditor;
