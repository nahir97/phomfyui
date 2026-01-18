
export const workflowTemplate = {
  "4": {
    "inputs": {

      "ckpt_name": "novaAnimeXL_ilV140.safetensors"
    },
    "class_type": "CheckpointLoaderSimple",
    "_meta": {
      "title": "Cargar Punto de Control"
    }
  },
  "6": {
    "inputs": {
      "text": "1girl",
      "clip": [
        "4",
        1
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "Codificar Texto CLIP (Prompt)"
    }
  },
  "7": {
    "inputs": {
      "text": "low quality, worst quality",
      "clip": [
        "4",
        1
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "Codificar Texto CLIP (Prompt)"
    }
  },
  "10": {
    "inputs": {
      "PowerLoraLoaderHeaderWidget": {
        "type": "PowerLoraLoaderHeaderWidget"
      },
      "lora_1": {
        "on": true,
        "lora": "SDXL\\dmd2_sdxl_4step_lora_fp16.safetensors",
        "strength": 1
      },
      "lora_2": {
        "on": false,
        "lora": "SDXL\\amuimprovedXL.safetensors",
        "strength": 0.7
      },
      "lora_3": {
        "on": false,
        "lora": "SDXL\\SDXL_FILM_PHOTOGRAPHY_STYLE_V1.safetensors",
        "strength": 0.3
      },
      "lora_4": {
        "on": false,
        "lora": "SDXL\\VHS_SDXL.safetensors",
        "strength": 0.3
      },
      "➕ Add Lora": "",
      "model": [
        "4",
        0
      ]
    },
    "class_type": "Power Lora Loader (rgthree)",
    "_meta": {
      "title": "Power Lora Loader (rgthree)"
    }
  },
  "12": {
    "inputs": {
      "add_noise": "enable",
      "noise_seed": [
        "15",
        0
      ],
      "steps": 8,
      "cfg": 1,
      "sampler_name": "euler_ancestral",
      "scheduler": "beta",
      "start_at_step": 0,
      "end_at_step": 10000,
      "return_with_leftover_noise": "enable",
      "model": [
        "10",
        0
      ],
      "positive": [
        "6",
        0
      ],
      "negative": [
        "7",
        0
      ],
      "latent_image": [
        "14",
        4
      ]
    },
    "class_type": "KSamplerAdvanced",
    "_meta": {
      "title": "KSampler (Avanzado)"
    }
  },
  "14": {
    "inputs": {
      "width": 512,
      "height": 512,
      "aspect_ratio": "2:3 portrait 512x768",
      "swap_dimensions": "Off",
      "upscale_factor": 1,
      "batch_size": 1
    },
    "class_type": "CR SD1.5 Aspect Ratio",
    "_meta": {
      "title": "🔳 CR SD1.5 Aspect Ratio"
    }
  },
  "15": {
    "inputs": {
      "seed": -1
    },
    "class_type": "Seed (rgthree)",
    "_meta": {
      "title": "Seed (rgthree)"
    }
  },
  "16": {
    "inputs": {
      "upscale_method": "nearest-exact",
      "scale_by": 2,
      "samples": [
        "12",
        0
      ]
    },
    "class_type": "LatentUpscaleBy",
    "_meta": {
      "title": "Escalar Latente Por"
    }
  },
  "17": {
    "inputs": {
      "noise": [
        "18",
        0
      ],
      "guider": [
        "19",
        0
      ],
      "sampler": [
        "20",
        0
      ],
      "sigmas": [
        "43",
        0
      ],
      "latent_image": [
        "16",
        0
      ]
    },
    "class_type": "SamplerCustomAdvanced",
    "_meta": {
      "title": "SamplerCustomAdvanced"
    }
  },
  "18": {
    "inputs": {
      "alpha": 1,
      "k": 3,
      "noise_seed": [
        "15",
        0
      ],
      "noise_type": "perlin"
    },
    "class_type": "AdvancedNoise",
    "_meta": {
      "title": "AdvancedNoise"
    }
  },
  "19": {
    "inputs": {
      "cfg": 1,
      "model": [
        "10",
        0
      ],
      "positive": [
        "6",
        0
      ],
      "negative": [
        "7",
        0
      ]
    },
    "class_type": "CFGGuider",
    "_meta": {
      "title": "GuíaCFG"
    }
  },
  "20": {
    "inputs": {
      "sampler_name": "euler_ancestral"
    },
    "class_type": "KSamplerSelect",
    "_meta": {
      "title": "KSamplerSelect"
    }
  },
  "23": {
    "inputs": {
      "VAE_type": "SDXL",
      "samples": [
        "25",
        2
      ]
    },
    "class_type": "HFRemoteVAEDecode",
    "_meta": {
      "title": "HFRemoteVAEDecode"
    }
  },
  "24": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": [
        "23",
        0
      ]
    },
    "class_type": "SaveImage",
    "_meta": {
      "title": "Guardar Imagen"
    }
  },
  "25": {
    "inputs": {
      "enable_cudnn": false,
      "cudnn_benchmark": false,
      "latent": [
        "17",
        0
      ]
    },
    "class_type": "CUDNNToggleAutoPassthrough",
    "_meta": {
      "title": "CFZ CUDNN Toggle"
    }
  },
  "43": {
    "inputs": {
      "steps": 4,
      "sigma_max": 12.33,
      "sigma_min": 0.02,
      "rho": 5
    },
    "class_type": "KarrasScheduler",
    "_meta": {
      "title": "KarrasScheduler"
    }
  }
};

export async function queuePrompt(
  serverUrl: string, 
  clientId: string, 
  prompt: string, 
  model?: string,
  customWorkflow?: any,
  nodeIds?: {
    promptNodeId?: string;
    negativePromptNodeId?: string;
    seedNodeId?: string;
    modelNodeId?: string;
  }
) {
  const baseUrl = serverUrl.replace(/\s/g, '');
  const workflow = JSON.parse(JSON.stringify(customWorkflow || workflowTemplate));
  
  const pId = nodeIds?.promptNodeId || "6";
  const mId = nodeIds?.modelNodeId || "4";
  const sId = nodeIds?.seedNodeId || "15";

  // Update prompt
  if (workflow[pId]) {
    workflow[pId].inputs.text = prompt;
  }

  // Update model if provided
  if (model && workflow[mId]) {
    workflow[mId].inputs.ckpt_name = model;
  }
  
  // Random seed
  const seed = Math.floor(Math.random() * 1000000000);
  if (workflow[sId]) {
    if (workflow[sId].class_type === "Seed (rgthree)" || workflow[sId].class_type === "KSampler" || workflow[sId].class_type === "KSamplerAdvanced") {
      if (workflow[sId].inputs.seed !== undefined) workflow[sId].inputs.seed = seed;
      if (workflow[sId].inputs.noise_seed !== undefined) workflow[sId].inputs.noise_seed = seed;
    } else {
      // Generic fallback for seed
      for (const key in workflow[sId].inputs) {
        if (key.toLowerCase().includes('seed')) {
          workflow[sId].inputs[key] = seed;
        }
      }
    }
  }

  const response = await fetch(`${baseUrl}/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: workflow, client_id: clientId }),
  });


  if (!response.ok) {
    throw new Error('Failed to queue prompt');
  }

  return await response.json();
}

export function createWebSocket(serverUrl: string, clientId: string, onMessage: (data: any) => void) {
  const baseUrl = serverUrl.replace(/\s/g, '');
  const wsUrl = baseUrl.replace('http', 'ws') + `/ws?clientId=${clientId}`;
  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  return ws;
}

export function getImageUrl(serverUrl: string, filename: string, subfolder: string = '', type: string = 'output') {
  const baseUrl = serverUrl.replace(/\s/g, '');
  return `${baseUrl}/view?filename=${filename}&subfolder=${subfolder}&type=${type}`;
}

export async function getModels(serverUrl: string): Promise<string[]> {
  const baseUrl = serverUrl.replace(/\s/g, '');
  try {
    const response = await fetch(`${baseUrl}/object_info/CheckpointLoaderSimple`);
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    const data = await response.json();
    return data.CheckpointLoaderSimple.input.required.ckpt_name[0];
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}

