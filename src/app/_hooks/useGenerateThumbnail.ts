import { useState } from "react";

// 썸네일 훅 타입 정의
interface UseGenerateThumbnailReturn {
  thumbnail: File | null; // 생성된 썸네일 (File 객체)
  generateThumbnail: (
    videoFile: File,
    containerWidth: number,
    containerHeight: number,
    timeInSeconds?: number,
  ) => Promise<File | null>; // 썸네일 생성 함수 (Promise로 반환)
}

export const useGenerateThumbnail = (): UseGenerateThumbnailReturn => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const generateThumbnail = (
    videoFile: File,
    containerWidth: number,
    containerHeight: number,
    timeInSeconds: number = 1,
  ): Promise<File | null> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        console.error("Canvas context를 가져올 수 없습니다.");
        reject(null);
        return;
      }

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      video.src = URL.createObjectURL(videoFile);
      video.crossOrigin = "anonymous";
      video.preload = "metadata";

      video.addEventListener("loadedmetadata", () => {
        video.currentTime = timeInSeconds;
      });

      video.addEventListener("seeked", () => {
        try {
          context.drawImage(
            video,
            0,
            0,
            video.videoWidth,
            video.videoHeight,
            0,
            0,
            canvas.width,
            canvas.height,
          );

          // 캔버스 내용을 Blob으로 변환
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const thumbnailFile = new File([blob], "thumbnail.jpg", {
                  type: "image/jpeg",
                });
                setThumbnail(thumbnailFile); // 상태 업데이트
                resolve(thumbnailFile); // 성공적으로 생성된 파일 반환
              } else {
                console.error("Blob 생성에 실패했습니다.");
                reject(null);
              }
            },
            "image/jpeg",
            0.8, // 이미지 품질 (0~1)
          );
        } catch (error) {
          console.error("썸네일 생성 중 오류가 발생했습니다:", error);
          reject(null);
        }
      });

      video.addEventListener("error", (e) => {
        console.error("동영상을 로드하는 중 오류가 발생했습니다:", e);
        setThumbnail(null);
        reject(null);
      });
    });
  };

  return { thumbnail, generateThumbnail };
};
// import { useState } from "react";

// // 썸네일 훅 타입 정의
// interface UseGenerateThumbnailReturn {
//   thumbnail: File | null; // 생성된 썸네 (File 객체)
//   generateThumbnail: (
//     videoFile: File,
//     containerWidth: number,
//     containerHeight: number,
//     timeInSeconds?: number,
//   ) => Promise<File | null>; // 썸네일 생성 함수를 promise로 반환
// }

// export const useGenerateThumbnail = (): UseGenerateThumbnailReturn => {
//   // 썸네일 URL을 저장하는 상태 변수
//   const [thumbnail, setThumbnail] = useState<string | null>(null);

//   // 썸네일 생성 함수
//   const generateThumbnail = (
//     videoFile: File,
//     containerWidth: number,
//     containerHeight: number,
//     timeInSeconds: number = 1,
//   ): Promise<File|null> => {
//     // 동적으로 <video>와 <canvas> 요소 생성
//     return new Promise((resolve, reject) => {

//     })
//     const video = document.createElement("video");
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");

//     if (!context) {
//       console.error("Canvas context를 가져올 수 없습니다.");
//       reject(null);
//       return;
//     }

//     // 캔버스 크기를 부모 컴포넌트의 크기로 설정
//     canvas.width = containerWidth;
//     canvas.height = containerHeight;

//     // 동영상 파일을 브라우저에서 사용할 수 있는 URL로 변환
//     video.src = URL.createObjectURL(videoFile);
//     video.crossOrigin = "anonymous"; // CORS 문제 방지
//     video.preload = "metadata"; // 메타데이터 미리 로드

//     // 동영상 메타데이터가 로드되면 특정 시간으로 이동
//     video.addEventListener("loadedmetadata", () => {
//       video.currentTime = timeInSeconds;
//     });

//     // 지정된 시간으로 이동 후 해당 프레임을 캡처
//     video.addEventListener("seeked", () => {
//       // 현재 프레임을 캔버스에 그리기
//       context.drawImage(
//         video,
//         0,
//         0,
//         video.videoWidth,
//         video.videoHeight,
//         0,
//         0,
//         canvas.width,
//         canvas.height,
//       );

//       // 캔버스 내용을 Blob으로 변환환
//       canvas.toBlob(
//         (blob) => {
//           if (blob) {
//             const thumbnailFile = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
//             setThumbnail(thumbnailFile); // 상태 업데이트
//             resolve(thumbnailFile); // 성공적으로 생성된 파일 반환
//           } else {
//             console.error("Blob 생성에 실패했습니다.");
//             reject(null);
//           }
//         },
//         "image/jpeg",
//         0.8, // 이미지 품질 (0~1)
//       );
//     } catch (error) {
//       console.error("썸네일 생성 중 오류가 발생했습니다:", error);
//       reject(null);
//     }
//   });

//   video.addEventListener("error", (e) => {
//     console.error("동영상을 로드하는 중 오류가 발생했습니다:", e);
//     setThumbnail(null);
//     reject(null);
//   });
// });
// };

// return { thumbnail, generateThumbnail };
// };

// // <video>와 < canvas > 를 이용해 특정 시간의 프레임을 캡처.
// // 캡처한 이미지를 Base64 URL로 변환.
// // 변환된 URL을 상태로 저장하여 컴포넌트에서 사용할 수 있도록 제공.

// // 주어진 useGenerateThumbnail 훅은 동영상 파일에서 특정 시간의 프레임을 캡처하여 Base64 URL로 변환하는 기능을 제공합니다. 그러나 이 훅은 현재 Blob이나 File 객체를 반환하지 않고 Base64 URL을 반환하므로, Swagger API 요청에서 요구하는 thumbnail(binary 파일)과 호환되지 않습니다. 따라서 수정해야 할 부분은 다음과 같습니다:
// // 문제점
// // Base64 URL 대신 Blob 또는 File 객체 반환 필요:
// // Swagger API는 thumbnail 필드에 binary 파일을 요구합니다. Base64 URL은 적합하지 않으므로 Blob 데이터를 생성하고 이를 File 객체로 변환해야 합니다.
