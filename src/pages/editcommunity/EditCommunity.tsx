import { useState, useRef, useEffect } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { createPost, getPost, updatePost } from "../../api/fetchPost";
import { useNavigate, useParams } from "react-router-dom";
import cancel from "../../assets/icons/cancel.svg";
import toast from "react-hot-toast";

export default function EditCommunity() {
  const navigate = useNavigate();
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

  function getFileNameFromKey(objectKey: string) {
    const uuidPattern =
      /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(.*)/i;

    const match = objectKey.match(uuidPattern);
    if (match) {
      return match[2];
    }

    return objectKey;
  }

  const getPostData = async (postId: string) => {
    if (!postId) return;

    try {
      const data = await getPost(postId);

      const { content, images } = data;
      const updatedContent = replacePlaceholdersWithUrls(content, images);

      setEdit(true);
      if (data.thumbnailImage) {
        const thumbnailFileName = getFileNameFromKey(
          data.thumbnailImage.split("/").pop()
        );
        setFileName(thumbnailFileName);
      }
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

  const [fileName, setFileName] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File>();
  const [title, setTitle] = useState("");
  const editorRef = useRef<Editor>(null);

  const extractImageContent = (
    htmlContent: string
  ): { content: string; images: string[] } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    let imageIndex = 0;
    const images: string[] = [];

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
      return null;
    }

    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  };

  const convertImagesToFiles = (images: string[]): File[] => {
    const files = images.map((img, index) => {
      return base64ToFile(img, `img${index}.jpg`);
    });

    return files.filter((file): file is File => file !== null);
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setFileName(file.name);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnail(undefined);
    setFileName("");
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

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    const request = new Blob([JSON.stringify({ title, content })], {
      type: "application/json",
    });
    formData.append("request", request);

    const imageFiles = convertImagesToFiles(images);
    imageFiles.forEach((file) => formData.append("images", file));

    try {
      if (edit) {
        if (!postId) return;
        await updatePost(postId, formData);
        navigate(`/community/${postId}`);
        toast.success("게시글이 수정되었습니다.", {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#09ACFB",
            color: "#FFFFFF",
            border: "1px solid #0187EE",
          },

          iconTheme: {
            primary: "#FFFFFF",
            secondary: "#09ACFB",
          },
        });
      } else {
        await createPost(formData);
        navigate("/community");
        toast.success("게시글이 작성되었습니다.", {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#09ACFB",
            color: "#FFFFFF",
            border: "1px solid #0187EE",
          },

          iconTheme: {
            primary: "#FFFFFF",
            secondary: "#09ACFB",
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="my-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        커뮤니티 글쓰기
      </h1>
      <div className="mb-6">
        <span className="font-medium block mb-1 text-gray-700">
          썸네일 이미지
        </span>
        <div className="flex items-center border rounded-md border-[#09ACFB] px-4 py-2 mb-1">
          <label
            htmlFor="thumbnail"
            className="bg-gray-200 font-medium border border-black px-[6px] py-[2px] rounded"
          >
            파일 선택
          </label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="hidden"
          />
          <div className="flex-grow flex items-center">
            <span className="px-2">{fileName || "선택 안 함"}</span>
            {fileName && (
              <button
                onClick={handleRemoveThumbnail}
                className="text-gray-500 font-semibold "
              >
                <img src={cancel} alt="썸네일 삭제" className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <label htmlFor="title" className="font-medium block mb-1 text-gray-700">
          제목
        </label>
        <input
          id="title"
          className="w-full px-4 py-3 border rounded-md border-[#09ACFB] focus:outline-none"
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
