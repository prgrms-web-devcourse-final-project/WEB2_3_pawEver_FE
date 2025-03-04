import { useState, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
//
export default function EditCommunity() {
  const [title, setTitle] = useState("");
  const editorRef = useRef<Editor>(null);

  const handleSubmit = () => {
    const editorInstance = editorRef.current?.getInstance();
    const contentMarkdown = editorInstance?.getMarkdown() || "";
    console.log("제목:", title);
    console.log("내용(Markdown):", contentMarkdown);
  };

  return (
    <section className="my-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        커뮤니티 글쓰기
      </h1>
      <div className="mb-6">
        <label htmlFor="title" className="font-medium block mb-1 text-gray-700">
          제목
        </label>
        <input
          id="title"
          className="w-full px-4 py-2 border rounded-md border-[#09ACFB] focus:outline-none"
          placeholder="게시글 제목을 입력하세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="font-medium block mb-1 text-gray-700">내용</label>
        <div className="rounded-xl shadow-sm border border-[#09ACFB] overflow-hidden ">
          <Editor
            ref={editorRef}
            initialEditType="wysiwyg"
            initialValue=" "
            placeholder="여기에 내용을 입력하세요."
            hideModeSwitch={true}
            usageStatistics={false}
            previewStyle="vertical"
            height="400px"
            toolbarItems={[
              ["heading", "bold", "italic", "strike"],
              ["ul", "ol", "task", "hr"],
              ["table", "link", "image"],
            ]}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#09ACFB] text-white font-medium rounded-md hover:bg-[#0187EE] transition-colors duration-200"
        >
          작성하기
        </button>
      </div>
    </section>
  );
}
