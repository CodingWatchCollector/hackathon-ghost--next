"use client";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // Import the WebGL backend
import React, { useEffect, useRef, useState } from "react";
import * as handpose from "@tensorflow-models/handpose";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";

interface Keypoint {
  part: string;
  position: {
    x: number;
    y: number;
  };
  score: number;
}

interface Hand {
  landmarks: [number, number, number][];
  annotations: {
    [key: string]: [number, number, number][];
  };
}

interface Pose {
  keypoints: Keypoint[];
}

const Move: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leftHand, setLeftHand] = useState<Hand | null>(null);
  const [rightHand, setRightHand] = useState<Hand | null>(null);
  const [pose, setPose] = useState<Pose | null>(null);
  const [bodyPartsTouching, setBodyPartsTouching] = useState<Keypoint[]>([]);
  const [touchingBodyPartLabel, setTouchingBodyPartLabel] =
    useState<string>("");

  useEffect(() => {
    const initializeTfjs = async () => {
      await tf.setBackend("webgl");
      await tf.ready();

      const [handModel, poseModel] = await Promise.all([
        handpose.load(),
        posenet.load(),
      ]);

      console.log("Handpose and PoseNet models loaded.");

      const detect = async () => {
        if (
          webcamRef.current &&
          webcamRef.current.video &&
          webcamRef.current.video.readyState === 4
        ) {
          const video = webcamRef.current.video;
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;

          webcamRef.current.video.width = videoWidth;
          webcamRef.current.video.height = videoHeight;
          canvasRef.current!.width = videoWidth;
          canvasRef.current!.height = videoHeight;

          const hands = await handModel.estimateHands(video);
          const poses = await poseModel.estimatePoses(video, {
            flipHorizontal: false,
            decodingMethod: "single-person",
          });

          if (hands.length > 0) {
            setLeftHand(hands[0]);
            if (hands.length > 1) {
              setRightHand(hands[1]);
            } else {
              setRightHand(null);
            }
          } else {
            setLeftHand(null);
            setRightHand(null);
          }

          if (poses.length > 0) {
            setPose(poses[0]);
            setBodyPartsTouching(
              poses[0].keypoints.filter((keypoint) =>
                isTouchingIndexFinger(keypoint, hands)
              )
            );

            const touchingParts = poses[0].keypoints
              .filter((keypoint) => isTouchingIndexFinger(keypoint, hands))
              .map((keypoint) => keypoint.part);

            setTouchingBodyPartLabel(touchingParts.join(", "));
          } else {
            setPose(null);
            setBodyPartsTouching([]);
            setTouchingBodyPartLabel("");
          }
        }
        requestAnimationFrame(detect);
      };

      detect();
    };

    initializeTfjs();
  }, []);

  const isTouchingIndexFinger = (
    keypoint: Keypoint,
    hands: Hand[]
  ): boolean => {
    if (hands.length > 0) {
      const indexFinger = hands[0].annotations.indexFinger[3];
      const dist = Math.sqrt(
        Math.pow(indexFinger[0] - keypoint.position.x, 2) +
          Math.pow(indexFinger[1] - keypoint.position.y, 2)
      );
      return dist < 30; // Adjust this threshold as needed
    }
    return false;
  };

  useEffect(() => {
    const ctx = canvasRef.current!.getContext("2d");

    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw hands
    if (leftHand) {
      drawHand(leftHand, ctx, "red");
    }

    if (rightHand) {
      drawHand(rightHand, ctx, "blue");
    }

    // Draw pose keypoints
    if (pose) {
      drawPose(pose, ctx);
    }
  }, [leftHand, rightHand, pose]);

  useEffect(() => {
    const ctx = canvasRef.current!.getContext("2d");
    if (!ctx) return;

    ctx.font = "10px Arial";
    ctx.fillStyle = "white";

    bodyPartsTouching.forEach((keypoint) => {
      ctx.beginPath();
      ctx.arc(keypoint.position.x, keypoint.position.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "yellow";
      ctx.fill();
      ctx.fillText(
        keypoint.part,
        keypoint.position.x + 10,
        keypoint.position.y
      );
    });
  }, [bodyPartsTouching]);

  const drawHand = (
    hand: Hand,
    ctx: CanvasRenderingContext2D,
    color: string
  ) => {
    hand.landmarks.forEach((landmark) => {
      ctx.beginPath();
      ctx.arc(landmark[0], landmark[1], 6, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    });
  };

  const drawPose = (pose: Pose, ctx: CanvasRenderingContext2D) => {
    pose.keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.5) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.font = "10px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(
          keypoint.part,
          keypoint.position.x + 10,
          keypoint.position.y
        );
      }
    });
  };

  return (
    <div className="App">
      <div
        className="container"
        style={{
          paddingLeft: "24px",
          paddingRight: "24px",
          borderRadius: "24px",
          left: 0,
          right: 0,
          bottom: "0",
          textAlign: "center",
          zIndex: 9,
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            top: 10,
            left: 10,
            zIndex: 10,
            width: "100%",
            height: "300px",
            background: "white",
            borderRadius: "25px",
            border: "1px solid black",
            fontSize: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {touchingBodyPartLabel}
        </div>
        <Webcam
          ref={webcamRef}
          style={{
            marginTop: "25px",
            borderRadius: "25px",
            position: "relative",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: "100%",
            height: "100%",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: -10000, // Move canvas out of visible area
            right: 0,
            textAlign: "center",
            zIndex: 10,
            width: "100%",
            height: "100%",
          }}
        />
        <div
          id="bodyPartTouchingLabel"
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            color: "red",
            zIndex: 11,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Move;
