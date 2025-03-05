
import { registerPlugin, type Plugin } from '@capacitor/core';

type option = {
    url: string
}
type AnalysisResult = {
    videoUrl: string
    pageUrl: string
}
interface WebViewPlugin extends Plugin {
    analysis(options: option): Promise<any>;
}

const webViewPlugin = registerPlugin<WebViewPlugin>('WebViewPlugin');

function analysis(options: option): Promise<AnalysisResult> {
    return webViewPlugin.analysis(options);
}

export { analysis };