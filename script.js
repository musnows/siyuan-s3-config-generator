// 加载主配置文件
async function loadProviderList() {
  try {
    const response = await fetch('./providers.yml');
    const text = await response.text();
    return jsyaml.load(text);
  } catch (error) {
    console.error('Failed to load provider list:', error);
    return null;
  }
}

// 加载服务商配置文件
async function loadConfig(configFile) {
  try {
    const response = await fetch(`./providers/${configFile}`);
    const text = await response.text();
    return jsyaml.load(text);
  } catch (error) {
    console.error(`Failed to load config for ${configFile}:`, error);
    return null;
  }
}

// 初始化页面
document.addEventListener('DOMContentLoaded', async () => {
  const providerSelect = document.getElementById('provider');
  const regionSelect = document.getElementById('region');
  const bucketInput = document.getElementById('bucket');
  const configDisplay = document.getElementById('config');

  let currentConfig = null;

  // 加载服务商列表
  const providerList = await loadProviderList();
  if (providerList) {
    providerList.providers.forEach(provider => {
      providerSelect.appendChild(new Option(provider.displayName, provider.name));
    });
  }

  // 当用户选择服务商时
  providerSelect.addEventListener('change', async () => {
    const selectedProvider = providerSelect.value;
    regionSelect.innerHTML = '<option value="">请选择您的地域 / Select a region</option>';
    configDisplay.innerHTML = '此处会显示思源笔记 S3 同步应填写的配置。<br>Siyuan S3 configuration will display here.';

    if (selectedProvider) {
      // 查找选中的服务商
      const provider = providerList.providers.find(p => p.name === selectedProvider);
      if (provider) {
        // 加载对应服务商的配置文件
        currentConfig = await loadConfig(provider.configFile);
        if (currentConfig) {
          // 动态加载地域选项
          currentConfig.buckets.forEach(bucket => {
            regionSelect.appendChild(new Option(bucket.region, bucket.region));
          });
        }
      }
    }
  });

  // 当用户选择地域或输入 Bucket 名称时
  regionSelect.addEventListener('change', updateConfig);
  bucketInput.addEventListener('input', updateConfig);

  function updateConfig() {
    const selectedRegion = regionSelect.value;
    const bucketName = bucketInput.value.trim();

    if (currentConfig && selectedRegion) {
      const bucket = currentConfig.buckets.find(b => b.region === selectedRegion);
      if (bucket) {
        const configToDisplay = {
          endpoint: bucket.config.endpoint,
          bucket: bucketName || '',
          region: bucket.config.region || selectedRegion,
          addressing: bucket.config.addressing || 'Path-style', // 默认值
          tls: bucket.config.tls || 'Verify' 
        };

        // 逐条显示配置项（只有当有bucket名称时才包含bucket行）
        let configHTML = `
          <div class="config-item"><strong>Endpoint:</strong> ${configToDisplay.endpoint}</div>
          <div class="config-item"><strong>Region:</strong> ${configToDisplay.region}</div>
          <div class="config-item"><strong>Addressing:</strong> ${configToDisplay.addressing}</div>
          <div class="config-item"><strong>TLS Verify:</strong> ${configToDisplay.tls}</div>
        `;
        
        if (bucketName) {
          configHTML = `
            <div class="config-item"><strong>Endpoint:</strong> ${configToDisplay.endpoint}</div>
            <div class="config-item"><strong>Bucket:</strong> ${configToDisplay.bucket}</div>
            <div class="config-item"><strong>Region:</strong> ${configToDisplay.region}</div>
            <div class="config-item"><strong>Addressing:</strong> ${configToDisplay.addressing}</div>
            <div class="config-item"><strong>TLS Verify:</strong> ${configToDisplay.tls}</div>
          `;
        }
        
        configDisplay.innerHTML = configHTML;
      }
    } else {
      configDisplay.innerHTML = '此处会显示思源笔记 S3 同步应填写的配置。<br>Siyuan S3 configuration will display here.';
    }
  }
});