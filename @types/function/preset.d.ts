interface PromptPreset {
  settings: {
    /** 最大上下文 token 数 */
    max_context: number;
    /** 最大回复 token 数 */
    max_completion_tokens: number;
    /** 每次生成几个回复 */
    reply_count: number;

    /** 是否流式传输 */
    should_stream: boolean;

    /** 温度 */
    temperature: number;
    /** 频率惩罚 */
    frequency_penalty: number;
    /** 存在惩罚 */
    presence_penalty: number;
    /** 重复惩罚 */
    repetition_penalty: number;
    top_p: number;
    min_p: number;
    top_k: number;
    top_a: number;

    /** 种子, -1 表示随机 */
    seed: number;

    /** 压缩系统消息: 将连续的系统消息合并为一条消息 */
    squash_system_messages: boolean;

    /** 推理强度, 即内置思维链的投入程度. 例如, 如果酒馆直连 gemini-2.5-flash, 则 `min` 将会不使用内置思维链 */
    reasoning_effort: 'auto' | 'min' | 'low' | 'medium' | 'high' | 'max';
    /** 请求思维链: 允许模型返回内置思维链的思考过程; 注意这只影响内置思维链显不显示, 不决定模型是否使用内置思维链 */
    request_thoughts: boolean;
    /** 请求图片: 允许模型在回复中返回图片 */
    request_images: boolean;
    /** 启用函数调用: 允许模型使用函数调用功能; 比如 cursor 借此在回复中读写文件、运行命令 */
    enable_function_calling: boolean;
    /** 启用网络搜索: 允许模型使用网络搜索功能 */
    enable_web_search: boolean;

    /** 是否允许发送图片作为提示词 */
    allow_images: 'disabled' | 'auto' | 'low' | 'high';
    /** 是否允许发送视频作为提示词 */
    allow_videos: boolean;

    /**
     * 角色名称前缀: 是否要为消息添加角色名称前缀, 以及怎么添加
     * - `none`: 不添加
     * - `default`: 为与角色卡不同名的消息添加角色名称前缀, 添加到 `content` 字段开头 (即发送的消息内容是 `角色名: 消息内容`)
     * - `content`: 为所有消息添加角色名称前缀, 添加到 `content` 字段开头 (即发送的消息内容是 `角色名: 消息内容`)
     * - `completion`: 在发送给模型时, 将角色名称写入到 `name` 字段; 仅支持字母数字和下划线, 不适用于 Claude、Google 等模型
     */
    character_name_prefix: 'none' | 'default' | 'content' | 'completion';
    /** 用引号包裹用户消息: 在发送给模型之前, 将所有用户消息用引号包裹 */
    wrap_user_messages_in_quotes: boolean;
  };

  /** 提示词列表里已经添加的提示词 */
  prompts: PresetPrompt[];
  /** 下拉框里没添加进来的提示词 */
  prompts_unused: PresetPrompt[];

  /** 额外字段, 用于为预设绑定额外数据 */
  extensions: Record<string, any>;
}

type PresetPrompt = PresetNormalPrompt | PresetSystemPrompt | PresetPlaceholderPrompt;
interface PresetNormalPrompt {
  id: string;
  enabled: boolean;
  name: string;
  /** 插入位置: `'relative'` 则按提示词相对位置插入, `number` 则插入到聊天记录中的对应深度 */
  position: 'relative' | number;

  role: 'system' | 'user' | 'assistant';
  content: string;

  /** 额外字段, 用于为预设提示词绑定额外数据 */
  extra?: Record<string, any>;
}
/** 预设中的酒馆系统提示词, 但其实相比于手动添加的提示词没有任何优势 */
interface PresetSystemPrompt {
  id: 'main' | 'nsfw' | 'jailbreak' | 'enhanceDefinitions';
  enabled: boolean;
  name: string;

  role: 'system' | 'user' | 'assistant';
  content: string;

  /** 额外字段, 用于为预设提示词绑定额外数据 */
  extra?: Record<string, any>;
}
/** 预设提示词中的占位符提示词, 对应于世界书条目、角色卡、玩家角色、聊天记录等提示词 */
interface PresetPlaceholderPrompt {
  id:
    | 'world_info_before'
    | 'persona_description'
    | 'char_description'
    | 'char_personality'
    | 'scenario'
    | 'world_info_after'
    | 'dialogue_examples'
    | 'chat_history';
  enabled: boolean;
  name: string;
  /** 插入位置: `'relative'` 则按提示词相对位置插入, `number` 则插入到聊天记录中的对应深度 */
  position: 'relative' | number;

  role: 'system' | 'user' | 'assistant';

  /** 额外字段, 用于为预设提示词绑定额外数据 */
  extra?: Record<string, any>;
}
function isPresetNormalPrompt(prompt: PresetPrompt): prompt is PresetNormalPrompt;
function isPresetSystemPrompt(prompt: PresetPrompt): prompt is PresetSystemPrompt;
function isPresetPlaceholderPrompt(prompt: PresetPrompt): prompt is PresetPlaceholderPrompt;

const default_preset: PromptPreset = {
  settings: {
    max_context: 2000000,
    max_completion_tokens: 300,
    reply_count: 1,

    should_stream: false,

    temperature: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    repetition_penalty: 1,
    top_p: 1,
    min_p: 0,
    top_k: 0,
    top_a: 0,

    seed: -1,

    squash_system_messages: false,

    reasoning_effort: 'auto',
    request_thoughts: false,
    request_images: false,
    enable_function_calling: false,
    enable_web_search: false,

    allow_images: 'disabled',
    allow_videos: false,

    character_name_prefix: 'none',
    wrap_user_messages_in_quotes: false,
  },
  prompts: [
    { id: 'worldInfoBefore', enabled: true, position: 'relative', role: 'system' },
    { id: 'personaDescription', enabled: true, position: 'relative', role: 'system' },
    { id: 'charDescription', enabled: true, position: 'relative', role: 'system' },
    { id: 'charPersonality', enabled: true, position: 'relative', role: 'system' },
    { id: 'scenario', enabled: true, position: 'relative', role: 'system' },
    { id: 'worldInfoAfter', enabled: true, position: 'relative', role: 'system' },
    { id: 'dialogueExamples', enabled: true, position: 'relative', role: 'system' },
    { id: 'chatHistory', enabled: true, position: 'relative', role: 'system' },
  ],
  prompts_unused: [],
  extensions: {},
} as const;

/**
 * 获取预设名称列表
 *
 * @returns 预设名称列表
 */
function getPresetNames(): string[];

/**
 * 获取酒馆正在使用的预设 (`'in_use'`) 是从哪个预设加载来的.
 *
 * 请务必注意这个说法, `'in_use'` 预设虽然是从 `getLoadedPresetName()` 预设加载而来, 但它的预设内容可能与 `getLoadedPresetName()` 预设不同.
 *   请回忆一下: 在酒馆中编辑预设后, 编辑结果会立即在在聊天中生效 (`'in_use'` 预设被更改),
 *   但我们没有点击保存按钮 (将 `'in_use'` 预设内容保存回 `getLoadedPresetName()` 预设), 一旦切换预设, 编辑结果就会丢失
 *
 * @returns 预设名称
 */
function getLoadedPresetName(): string;

/**
 * 加载 `preset_name` 预设作为酒馆正在使用的预设 (`'in_use'`)
 *
 * @param preset_name 预设名称
 * @returns 是否成功切换, 可能因预设不存在等原因而失败
 */
function loadPreset(preset_name: Exclude<string, 'in_use'>): boolean;

/**
 * 新建 `preset_name` 预设, 内容为 `preset`
 *
 * @param preset_name 预设名称
 * @param preset 预设内容; 不填则使用默认内容
 *
 * @returns 是否成功创建, 如果已经存在同名预设或尝试创建名为 `'in_use'` 的预设会失败
 */
async function createPreset(
  preset_name: Exclude<string, 'in_use'>,
  preset: PromptPreset = default_preset,
): Promise<boolean>;

/**
 * 创建或替换名为 `preset_name` 的预设, 内容为 `preset`
 *
 * @param preset_name 预设名称
 * @param preset 预设内容; 不填则使用默认内容
 *
 * @returns 如果发生创建, 则返回 `true`; 如果发生替换, 则返回 `false`
 */
async function createOrReplacePreset(
  preset_name: 'in_use' | string,
  preset: PromptPreset = default_preset,
): Promise<boolean>;

/**
 * 删除 `preset_name` 预设
 *
 * @param preset_name 预设名称
 * @returns 是否成功删除, 可能因预设不存在等原因而失败
 */
async function deletePreset(preset_name: Exclude<string, 'in_use'>): Promise<boolean>;

/**
 * 重命名 `preset_name` 预设为 `new_name`
 *
 * @param preset_name 预设名称
 * @param new_name 新名称
 * @returns 是否成功重命名, 可能因预设不存在等原因而失败
 */
async function renamePreset(preset_name: Exclude<string, 'in_use'>, new_name: string): Promise<boolean>;

/**
 * 获取 `preset_name` 预设的内容
 *
 * @param preset_name 预设名称
 * @returns 预设内容
 */
function getPreset(preset_name: 'in_use' | string): PromptPreset | null;

/**
 * 完全替换 `preset_name` 预设的内容为 `preset`
 *
 * @param preset_name 预设名称
 * @param preset 预设内容
 *
 * @example
 * // 为酒馆正在使用的预设开启流式传输
 * const preset = getPreset('in_use');
 * preset.settings.should_stream = true;
 * await replacePreset('in_use', preset);
 *
 * @example
 * // 将 '预设A' 的条目按顺序复制到 '预设B' 开头
 * const preset_a = getPreset('预设A');
 * const preset_b = getPreset('预设B');
 * preset_b.prompts = [...preset_a.prompts, ...preset_b.prompts];
 * await replacePreset('预设B', preset_b);
 */
async function replacePreset(preset_name: 'in_use' | string, preset: PromptPreset): Promise<void>;

type PresetUpdater = ((preset: PromptPreset) => PromptPreset) | ((preset: PromptPreset) => Promise<PromptPreset>);
/**
 * 用 `updater` 函数更新 `preset_name` 预设
 *
 * @param preset_name 预设名称
 * @param updater 用于更新预设的函数. 它应该接收预设内容作为参数, 并返回更新后的预设内容.
 *
 * @returns 更新后的预设内容
 *
 * @example
 * // 为酒馆正在使用的预设开启流式传输
 * await updatePresetWith('in_use', preset => {
 *   preset.settings.should_stream = true;
 *   return preset;
 * });
 *
 * @example
 * // 将 '预设A' 的条目按顺序复制到 '预设B' 开头
 * await updatePresetWith('预设B', preset => {
 *   const another_preset = getPreset('预设A');
 *   preset.prompts = [...another_preset.prompts, ...preset.prompts];
 *   return preset;
 * });
 */
async function updatePresetWith(preset_name: 'in_use' | string, updater: PresetUpdater): Promise<PromptPreset>;

/**
 * 将预设内容修改回预设中, 如果某个内容不存在, 则该内容将会采用原来的值
 *
 * @param preset_name 预设名称
 * @param preset 预设内容
 *
 * @returns 更新后的预设内容
 *
 * @example
 * // 为酒馆正在使用的预设开启流式传输
 * await setPreset('in_use', { settings: { should_stream: true } });
 *
 * @example
 * // 将 '预设A' 的条目按顺序复制到 '预设B' 开头
 * await setPreset('预设B', {
 *   prompts: [...getPreset('预设A').prompts, ...getPreset('预设B').prompts],
 * });
 */
async function setPreset(preset_name: 'in_use' | string, preset: PartialDeep<PromptPreset>): Promise<PromptPreset>;
