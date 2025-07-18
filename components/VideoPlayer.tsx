import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
    Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Play, X, Maximize, Minimize } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface VideoPlayerProps {
    videoUrl: string;
    title: string;
    visible: boolean;
    onClose: () => void;
}

// Helper function to convert YouTube URL to embed format
const getEmbedUrl = (url: string): string => {
    // Check if it's a YouTube URL
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(youtubeRegex);

    if (match) {
        const videoId = match[1];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }

    // Return original URL if not YouTube
    return url;
};

// Helper function to check if URL is YouTube
const isYouTubeUrl = (url: string): boolean => {
    return /(?:youtube\.com|youtu\.be)/.test(url);
};

export default function VideoPlayer({ videoUrl, title, visible, onClose }: VideoPlayerProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoadStart = () => {
        setIsLoading(true);
        setHasError(false);
    };

    const handleLoadEnd = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handleClose = () => {
        setIsFullscreen(false);
        onClose();
    };

    const embedUrl = getEmbedUrl(videoUrl);
    const isYouTube = isYouTubeUrl(videoUrl);

    // Create HTML content for video player
    const videoHTML = isYouTube ? `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #000;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .video-container {
                position: relative;
                width: 100%;
                height: 100%;
                max-width: 100%;
                max-height: 100%;
            }
            iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
            }
            .error-container {
                color: white;
                text-align: center;
                padding: 20px;
            }
        </style>
    </head>
    <body>
        <div class="video-container">
            <iframe
                src="${embedUrl}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                onload="window.ReactNativeWebView?.postMessage('loadend')"
                onerror="window.ReactNativeWebView?.postMessage('error')"
            ></iframe>
        </div>
        <script>
            window.addEventListener('load', function() {
                window.ReactNativeWebView?.postMessage('loadend');
            });
        </script>
    </body>
    </html>
  ` : `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #000;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            video {
                width: 100%;
                height: 100%;
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            }
            .error-container {
                color: white;
                text-align: center;
                padding: 20px;
            }
            .loading-container {
                color: white;
                text-align: center;
                padding: 20px;
            }
        </style>
    </head>
    <body>
        <video
            controls
            autoplay
            preload="metadata"
            controlsList="nodownload"
            onloadstart="window.ReactNativeWebView?.postMessage('loadstart')"
            onloadeddata="window.ReactNativeWebView?.postMessage('loadend')"
            onerror="window.ReactNativeWebView?.postMessage('error')"
        >
            <source src="${videoUrl}" type="video/mp4">
            <div class="error-container">
                <h3>Video not supported</h3>
                <p>Your browser doesn't support HTML5 video.</p>
            </div>
        </video>
    </body>
    </html>
  `;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle={isFullscreen ? "fullScreen" : "pageSheet"}
            onRequestClose={handleClose}
        >
            <View style={[styles.container, isFullscreen && styles.fullscreenContainer]}>
                {/* Header */}
                <View style={[styles.header, isFullscreen && styles.headerHidden]}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <X size={24} color="#1F2937" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle} numberOfLines={1}>
                            {title}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={toggleFullscreen} style={styles.fullscreenButton}>
                        {isFullscreen ? (
                            <Minimize size={20} color="#1F2937" />
                        ) : (
                            <Maximize size={20} color="#1F2937" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Video Player */}
                <View style={[styles.videoContainer, isFullscreen && styles.videoContainerFullscreen]}>
                    {hasError ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorTitle}>Unable to load video</Text>
                            <Text style={styles.errorMessage}>
                                Please check your internet connection and try again.
                            </Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={() => {
                                    setHasError(false);
                                    setIsLoading(true);
                                }}
                            >
                                <Text style={styles.retryButtonText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            {isLoading && (
                                <View style={styles.loadingContainer}>
                                    <Text style={styles.loadingText}>Loading video...</Text>
                                </View>
                            )}
                            <WebView
                                source={{ html: videoHTML }}
                                style={styles.webview}
                                allowsInlineMediaPlayback={true}
                                mediaPlaybackRequiresUserAction={false}
                                allowsFullscreenVideo={true}
                                onLoadStart={handleLoadStart}
                                onLoadEnd={handleLoadEnd}
                                onError={handleError}
                                onMessage={(event) => {
                                    const message = event.nativeEvent.data;
                                    switch (message) {
                                        case 'loadstart':
                                            handleLoadStart();
                                            break;
                                        case 'loadend':
                                            handleLoadEnd();
                                            break;
                                        case 'error':
                                            handleError();
                                            break;
                                    }
                                }}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                startInLoadingState={true}
                                scalesPageToFit={true}
                                bounces={false}
                                scrollEnabled={false}
                            />
                        </>
                    )}
                </View>

                {/* Video Info */}
                {!isFullscreen && (
                    <View style={styles.videoInfo}>
                        <Text style={styles.videoTitle}>{title}</Text>
                        <Text style={styles.videoDescription}>
                            Watch this video to learn about the concepts covered in this lesson.
                        </Text>
                    </View>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    fullscreenContainer: {
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerHidden: {
        display: 'none',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    closeButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        flex: 1,
    },
    fullscreenButton: {
        padding: 8,
    },
    videoContainer: {
        flex: 1,
        backgroundColor: '#000000',
        position: 'relative',
    },
    videoContainerFullscreen: {
        flex: 1,
    },
    webview: {
        flex: 1,
        backgroundColor: '#000000',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
        zIndex: 1,
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
        padding: 20,
    },
    errorTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    errorMessage: {
        color: '#CCCCCC',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    retryButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    videoInfo: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    videoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    videoDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
});