// const {getDefaultConfig} = require("expo/metro-config");
// const {withNativeWind} = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, {input: "./styles/global.css"});

const {getDefaultConfig} = require("expo/metro-config");
const {withNativeWind} = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {input: "./styles/global.css"});

// Additional optimizations
config.transformer = {
	...config.transformer,
	minifierPath: "metro-minify-terser",
	minifierConfig: {
		keep_classnames: true,
		keep_fnames: true,
		mangle: {
			keep_classnames: true,
			keep_fnames: true,
		},
	},
};

config.resolver = {
	...config.resolver,
	sourceExts: ["jsx", "js", "ts", "tsx", "cjs"],
};

module.exports = config;
