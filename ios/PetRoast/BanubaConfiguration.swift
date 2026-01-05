//
//  BanubaConfiguration.swift
//  PetRoast
//
//  This file contains the Banuba SDK configuration for iOS
//

import Foundation
import BanubaSdk

class BanubaConfiguration {
    
    // MARK: - Configuration
    static let shared = BanubaConfiguration()
    
    private init() {}
    
    // MARK: - Properties
    private let licenseToken = "Qk5CIM4a8uO4B1/ETYrJQq4PwMLO79N0EjAI1V7R6/NFtpwSJXE7SRj7LFkZghv43bI5DSjsf/6eiV4MOparQqEV3yzOAJzxU0XR1xGTZBPeWiNkqfr/4HkS6zpuNjJsXwjzBYTdoe4bkvIo89GWBSpo/T4xK3ufVV7NBWZepf9tFYjWXaH5IL92sUfB52O1eNSVDhvfz/Lj7SgIwQjRzd5OY3Z7avvdJnBFm2/NQe4deDFgI3QvC1JXC8ffkMJKLEq1/x6vbxovZbksGUy0tRGRX86BCap36UuIj/PqP7+FxW7/kfCteRUigDe7/zn0wpIqtlB/KrL9W+ZPZMnBpPjTLJ2qkFLyo40lmfNS2ipt5eMLh9gYnUMYqAoe0+XW0PJCk71ZmOrlJEPMy/WXzn9TuGoAjkfriTiZvT8C/IyvGXfcCZUVbVXHj05RjLiVIlEG+rDVVOq7LOl7hIAUzeVdyYF8NRcRAZ1E4KOlcOdx1hVo6hXGXxR9VUsF/IylVODPRzRAPdYrfTmqsMjNr6fGEahn7UjjYr9Koi2xR9WaKWOgeJDTfUrNUiGqzXngmzSpuGM6uafPouM9aKRIacApNddfHKUV4efYETVFbgEvDNFRtKezI6HNy0g0OXc607r2HI2cYDHnHMw12/mqX8e9" // Your actual license token
    
    // MARK: - Methods
    func configureBanubaSDK() {
        // Initialize Banuba SDK with your license
        do {
            try BanubaManager.shared().setLicense(licenseToken)
            print("Banuba SDK configured successfully")
        } catch {
            print("Failed to configure Banuba SDK: \(error)")
        }
    }
    
    func initializeCamera() -> CameraController? {
        let cameraController = CameraController()
        
        // Configure camera settings
        cameraController.cameraConfig = CameraConfig(
            cameraType: .front, // Default to front camera
            resolution: .high,
            fps: 30
        )
        
        // Configure face AR settings
        cameraController.faceArConfig = FaceArConfig(
            enableFaceDetection: true,
            enableFaceTracking: true,
            enableFaceMorphing: true
        )
        
        return cameraController
    }
}