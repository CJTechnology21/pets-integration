package com.petroast

import android.app.Application
import com.banuba.sdk.BanubaManager
import com.banuba.sdk.camera.CameraConfig
import com.banuba.sdk.face_ar.FaceArConfig

class BanubaManager {
    companion object {
        private const val LICENSE_TOKEN = "Qk5CIM4a8uO4B1/ETYrJQq4PwMLO79N0EjAI1V7R6/NFtpwSJXE7SRj7LFkZghv43bI5DSjsf/6eiV4MOparQqEV3yzOAJzxU0XR1xGTZBPeWiNkqfr/4HkS6zpuNjJsXwjzBYTdoe4bkvIo89GWBSpo/T4xK3ufVV7NBWZepf9tFYjWXaH5IL92sUfB52O1eNSVDhvfz/Lj7SgIwQjRzd5OY3Z7avvdJnBFm2/NQe4deDFgI3QvC1JXC8ffkMJKLEq1/x6vbxovZbksGUy0tRGRX86BCap36UuIj/PqP7+FxW7/kfCteRUigDe7/zn0wpIqtlB/KrL9W+ZPZMnBpPjTLJ2qkFLyo40lmfNS2ipt5eMLh9gYnUMYqAoe0+XW0PJCk71ZmOrlJEPMy/WXzn9TuGoAjkfriTiZvT8C/IyvGXfcCZUVbVXHj05RjLiVIlEG+rDVVOq7LOl7hIAUzeVdyYF8NRcRAZ1E4KOlcOdx1hVo6hXGXxR9VUsF/IylVODPRzRAPdYrfTmqsMjNr6fGEahn7UjjYr9Koi2xR9WaKWOgeJDTfUrNUiGqzXngmzSpuGM6uafPouM9aKRIacApNddfHKUV4efYETVFbgEvDNFRtKezI6HNy0g0OXc607r2HI2cYDHnHMw12/mqX8e9" // Your actual license token
        
        fun initialize(application: Application) {
            try {
                // Initialize Banuba SDK with your license
                BanubaManager.setLicense(LICENSE_TOKEN)
                println("Banuba SDK initialized successfully")
            } catch (e: Exception) {
                println("Failed to initialize Banuba SDK: ${e.message}")
            }
        }
        
        fun getCameraConfig(): CameraConfig {
            return CameraConfig(
                cameraType = com.banuba.sdk.camera.CameraType.FRONT, // Default to front camera
                resolution = com.banuba.sdk.common.Resolution.HIGH,
                fps = 30
            )
        }
        
        fun getFaceArConfig(): FaceArConfig {
            return FaceArConfig(
                enableFaceDetection = true,
                enableFaceTracking = true,
                enableFaceMorphing = true
            )
        }
    }
}