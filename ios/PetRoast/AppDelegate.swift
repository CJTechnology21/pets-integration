import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import BanubaSdk

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    // Initialize Banuba SDK
    initializeBanubaSDK()
    
    factory.startReactNative(
      withModuleName: "PetRoast",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
  
  private func initializeBanubaSDK() {
    // Configure Banuba SDK with your license
    do {
      try BanubaManager.shared().setLicense("Qk5CIM4a8uO4B1/ETYrJQq4PwMLO79N0EjAI1V7R6/NFtpwSJXE7SRj7LFkZghv43bI5DSjsf/6eiV4MOparQqEV3yzOAJzxU0XR1xGTZBPeWiNkqfr/4HkS6zpuNjJsXwjzBYTdoe4bkvIo89GWBSpo/T4xK3ufVV7NBWZepf9tFYjWXaH5IL92sUfB52O1eNSVDhvfz/Lj7SgIwQjRzd5OY3Z7avvdJnBFm2/NQe4deDFgI3QvC1JXC8ffkMJKLEq1/x6vbxovZbksGUy0tRGRX86BCap36UuIj/PqP7+FxW7/kfCteRUigDe7/zn0wpIqtlB/KrL9W+ZPZMnBpPjTLJ2qkFLyo40lmfNS2ipt5eMLh9gYnUMYqAoe0+XW0PJCk71ZmOrlJEPMy/WXzn9TuGoAjkfriTiZvT8C/IyvGXfcCZUVbVXHj05RjLiVIlEG+rDVVOq7LOl7hIAUzeVdyYF8NRcRAZ1E4KOlcOdx1hVo6hXGXxR9VUsF/IylVODPRzRAPdYrfTmqsMjNr6fGEahn7UjjYr9Koi2xR9WaKWOgeJDTfUrNUiGqzXngmzSpuGM6uafPouM9aKRIacApNddfHKUV4efYETVFbgEvDNFRtKezI6HNy0g0OXc607r2HI2cYDHnHMw12/mqX8e9")
      print("Banuba SDK initialized successfully")
    } catch {
      print("Failed to initialize Banuba SDK: \(error)")
    }
  }
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
