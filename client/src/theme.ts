export const theme = {
  rounding: 4,
  spacing: 24,
  global: {
    colors: {
      brand: "#7700cc",
      background: "#111111",
      "background-back": "#111111",
      "background-front": "#222222",
      "background-contrast": "#FFFFFF11",
      text: "#EEEEEE",
      "text-strong": "#FFFFFF",
      "text-weak": "#CCCCCC",
      "text-xweak": "#999999",
      border: "#444444",
      control: "brand",
      "active-background": "background-contrast",
      "active-text": "text-strong",
      "selected-background": "brand",
      "selected-text": "text-strong",
      "status-critical": "#FF4040",
      "status-warning": "#FFAA15",
      "status-ok": "#00C781",
      "status-unknown": "#CCCCCC",
      "status-disabled": "#CCCCCC",
      "graph-0": "brand",
      "graph-1": "status-warning",
    },
    active: {
      background: "active-background",
      color: "active-text",
    },
    hover: {
      background: "active-background",
      color: "active-text",
    },
    selected: {
      background: "selected-background",
      color: "selected-text",
    },
    control: {
      border: {
        radius: "0",
        width: "0",
      },
    },
    input: {
      padding: {
        horizontal: "0",
        vertical: "8px",
      },
    },
  },
  text: {
    // Button の size を small にすると padding の調整ができなくなるので
    // 一時的に medium を Button の small として扱うようにする
    small: {
      size: "18px",
    },
    medium: {
      size: "14px",
    },
  },
  textInput: {
    extend: "border-bottom: 1px solid #444444;",
  },
  button: {
    padding: {
      horizontal: "4px",
    },
  },
  anchor: {
    color: "accent-1",
  },
  layer: {
    background: "#111111",
  },
};
