const path = require('path');
const env = process.env.NODE_ENV

module.exports = {
    entry: { app: ['./src/index.tsx', 'react-hot-loader/patch'] },
    devtool: 'cheap-module-eval-source-map', // 添加source=map
    mode: env, // 环境设置
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    devServer: {  //开启dev环境的web server
        publicPath: '/',
        contentBase: BUILD_PATH,
        historyApiFallback: true,
        hot: true,
        open: true,
        inline: true,
        port: 8080,
        host: 'localhost',
        openPage: '',
        proxy: {},
        quiet: true,
        compress: true // 开发服务器是否启动gzip等压缩
        /*  https: {
            key: fs.readFileSync('/path/to/server.key'),
            cert: fs.readFileSync('/path/to/server.crt'),
            ca: fs.readFileSync('/path/to/ca.pem')
        } */
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: env === 'production'
                    ? [
                        MiniCssExtractPlugin.loader,
                        'css-loader?importLoaders=1',
                        'postcss-loader',
                        'sass-loader'

                    ]
                    : [
                        'css-hot-loader',
                        MiniCssExtractPlugin.loader,
                        'css-loader?importLoaders=1',
                        'postcss-loader',
                        'sass-loader'
                    ]
            }, {
                test: /\.less$/,
                use: [
                    'css-hot-loader',
                    { loader: 'style-loader', options: { sourceMap: true } },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: loader => [
                                PostcssPxtorem({
                                    rootValue: 100,
                                    propWhiteList: ['*']
                                }),
                                AutoPrefixer({ //自动补全各个浏览器的前缀
                                    browsers: ['last 2 versions', '> 1%', 'ie >= 8']
                                })
                            ]
                        }
                    },
                    { loader: 'less-loader', options: { sourceMap: true, modifyVars: theme } }
                ]
            }, {
                test: /\.css$/,
                include: [path.resolve('src')],
                use: ['css-hot-loader', 'style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.jsx?$/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'eslint-loader',
                        options: { fix: true }
                    }
                ],
                include: [path.resolve(__dirname, 'src')], // 指定检查的目录
                exclude: /node_modules/ // 忽略检查的目录
            }, {
                test: /\.jsx?$/, // 用babel编译jsx和es6
                include: [path.resolve(__dirname, 'src')], // 指定检查的目录
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: ['react', 'stage-2', ['env', { modules: false }]],
                    // modules关闭 Babel 的模块转换功能，保留原本的 ES6 模块化语法
                    plugins: ['transform-runtime', 'transform-decorators-legacy', 'react-hot-loader/babel']
                }
            },
            {
                test: /\.tsx?$/, // 用babel编译jsx和es6
                include: [path.resolve(__dirname, 'src')], // 指定检查的目录
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            useBabel: true,
                            babelOptions: {
                                babelrc: false /* Important line */,
                                presets: ['react', 'stage-2', ['env', { modules: false }]], // 关闭 Babel 的模块转换功能，保留原本的 ES6 模块化语法
                                plugins: ['transform-runtime', 'react-hot-loader/babel']
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/,
                use: ['url-loader']
            },
            // {
            //     test: /\.(svg)$/i,
            //     use: ['svg-sprite-loader'],
            //     include: svgDirs // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
            // },
            {
                test: /\.(png|jpg|gif)$/,
                use: ['url-loader?limit=8192&name=images/[hash:8].[name].[ext]']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.html', // 生成的html存放路径，相对于 path
            template: './src/index.html',
            inject: true, // 允许插件修改哪些内容，包括head与body
            hash: true // 为静态资源生成hash值
        }),
        new AddAssetHtmlPlugin({ // 在html中引入公共文件的js
            filepath: path.resolve(__dirname, 'build/vendor/*.dll.js')
        }),

        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
    ],
    resolve: {
        modules: ['node_modules', path.join(__dirname, './node_modules')],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.less', '.scss', '.json'],
        alias: {
            components: path.resolve(APP_PATH, './components')
        }
    },
    watch: env === 'devlopment',
    watchOptions: {
        ignored: /node_modules/, // 忽略不用监听变更的目录
        aggregateTimeout: 500, // 防止重复保存频繁重新编译,500毫米内重复保存不打包
        poll: 1000 // 每秒询问的文件变更的次数
    }
}
