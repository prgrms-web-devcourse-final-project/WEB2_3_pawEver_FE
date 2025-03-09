import { useState, useRef, useEffect } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { createPost, getPost, updatePost } from "../../api/fetchPost";
import { useParams } from "react-router-dom";
//
export default function EditCommunity() {
  const [edit, setEdit] = useState<boolean>(false);

  const { id: postId } = useParams();

  const replacePlaceholdersWithUrls = (
    content: string,
    uploadedUrls: string[]
  ) => {
    return content.replace(/{{images(\d+)}}/g, (_, index) => {
      return `${uploadedUrls[parseInt(index, 10)]}`;
    });
  };

  const getPostData = async (postId: string) => {
    if (!postId) return;

    try {
      const data = await getPost(postId);

      console.log(data);
      const { content, images } = data;
      const updatedContent = replacePlaceholdersWithUrls(content, images);

      setEdit(true);
      setTitle(data.title);
      editorRef.current?.getInstance().setMarkdown(updatedContent);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!postId) return;
    getPostData(postId);
  }, [postId]);

  const [title, setTitle] = useState("");
  const editorRef = useRef<Editor>(null);

  const extractImageContent = (
    htmlContent: string
  ): { content: string; images: string[] } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    let imageIndex = 0;
    const images: string[] = [];

    // Base64로 인코딩된 이미지 찾기
    doc.querySelectorAll("img").forEach((img) => {
      const src = img.src;
      if (src.startsWith("data:image")) {
        images.push(src);
        const placeholder = `{{images${imageIndex}}}`;
        img.setAttribute("src", placeholder);
        imageIndex++;
      }
    });

    const content = doc.body.innerHTML.trim();
    return { content, images };
  };

  // 이미지 파일 첨부
  const base64ToFile = (base64: string, fileName: string): File | null => {
    const arr = base64.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);

    if (!mimeMatch) {
      console.error("Invalid Base64 string");
      return null; // MIME 타입이 없으면 null 반환
    }

    const mime = mimeMatch[1]; // MIME 타입 추출
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  };

  // 이미지 파일 객체로 변환
  const convertImagesToFiles = (images: string[]): File[] => {
    const files = images.map((img, index) => {
      return base64ToFile(img, `img${index}.jpg`);
    });

    return files.filter((file): file is File => file !== null); // null 제거
  };

  const handleSubmit = async () => {
    const editorInstance = editorRef.current?.getInstance();
    const htmlContent = editorInstance?.getHTML() || "";

    if (!title.trim() || !htmlContent.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const { content, images } = extractImageContent(htmlContent);

    const formData = new FormData();

    // request (JSON 데이터를 Blob으로 변환 후 추가)
    const request = new Blob([JSON.stringify({ title, content })], {
      type: "application/json",
    });
    formData.append("request", request);

    const imageFiles = convertImagesToFiles(images);
    imageFiles.forEach((file) => formData.append("images", file));

    try {
      if (edit) {
        if (!postId) return;
        const result = await updatePost(postId, formData);
        return result;
      }
      const result = await createPost(formData);

      console.log("게시글 등록 성공:", result);
      return result;
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      throw error;
    }
  };

  return (
    <section className="my-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        커뮤니티 글쓰기
      </h1>
      <div className="mb-6">
        {/* 썸네일 추가 */}
        {/* <label
          htmlFor="thumbnail"
          className="font-medium block mb-1 text-gray-700"
        >
          썸네일 이미지
        </label>
        <input
          id="thumbnail"
          type="file"
          accept="image/*"
         onChange={}
          className="w-full px-4 py-2 border rounded-md border-[#09ACFB] focus:outline-none"
        /> */}
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
          {edit ? "수정하기" : "작성하기"}
        </button>
      </div>
    </section>
  );
}
