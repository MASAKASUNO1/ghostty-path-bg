# ghostty-bg (`gbg`)

ディレクトリごとに Ghostty の背景色を切り替える小さな CLI。プロジェクトごとに 1 コマンド。

https://github.com/user-attachments/assets/28d9a5a6-a82c-4da5-b39d-c8d9bf58036f

`gbg` は依存ゼロの小さな Node 製 CLI です。標準の
[OSC 11](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html) エスケープ
シーケンスを送って現在のウィンドウの背景色を即座に変え、その色を**ディレクトリ
ごとに記憶**します。シェルフックを入れておけば、`cd` でそのディレクトリの色が
自動で適用されます。Ghostty の fork や特別な API は不要です。

> [!TIP]
> セットアップを自分でやらずに済ませたい場合は、この README をそのまま
> Claude Code や Codex などのコーディングエージェントに渡して
> 「この README の通りに gbg をインストールして設定して」と頼んでください。
> インストールから zsh フックの追加まで代わりにやってくれます。

## インストール

```sh
npm install -g ghostty-bg
```

インストールせずに試す場合:

```sh
npx ghostty-bg --color dracula
```

## 使い方

```sh
gbg                     # パレットからランダムに選び、このディレクトリに記憶
gbg --color dracula     # 名前付きテーマ
gbg --color "#1a2b3c"   # HEX 値 (#rgb または #rrggbb)
gbg teal                # --color の短縮形
gbg --no-save tomato    # 現在のウィンドウのみ（記憶しない）
gbg --reset             # このディレクトリの色を忘れて背景をリセット
gbg --list              # 利用可能な色名の一覧
gbg shell-init          # zsh の cd フックを出力
gbg --help              # ヘルプ
gbg --version           # バージョン
```

短縮フラグ: `-c` (color), `-n` (no-save), `-r` (reset), `-l` (list),
`-h` (help), `-v` (version)。

## 色の指定

`--color` は 3 種類の値を受け付けます。

- **名前付きテーマ** — `dracula`, `nord`, `gruvbox`, `tokyonight`,
  `catppuccin`, `solarized`, `github-dark` など約 40 種類。`gbg --list` で確認。
- **CSS 色名** — `red`, `teal`, `midnightblue`, `rebeccapurple` など。
- **HEX** — `#rgb` または `#rrggbb`（先頭の `#` は省略可）。

引数なしの `gbg` は、読みやすい暗色のパレットからランダムに 1 色を選びます。

## ディレクトリごとの色

デフォルトで `gbg` は次の 2 つを行います。

1. 現在のウィンドウの背景色を OSC 11 で即座に変更する。
2. その色を**現在のディレクトリ**に記憶する。

`cd` で記憶した色を自動適用するには、シェルにフックを追加します。

```sh
grep -q 'gbg shell-init' ~/.zshrc || echo 'eval "$(gbg shell-init)"' >> ~/.zshrc
```

追加後の挙動:

- 記憶済みのディレクトリに `cd` する → その色が適用される。
- それ以外の場所に `cd` する → 背景がテーマの既定色に戻る。
- `gbg --no-save` は記憶せず、現在のウィンドウにだけ適用する。
- `gbg --reset` は現在のディレクトリの色を忘れる。

フックは純粋な zsh で、小さな `paths` ファイルを `awk` で読むだけなので、`cd`
ごとに Node を起動するコストはかかりません。色は**ディレクトリの完全一致**で
照合されます。

## 仕組み

`gbg` は背景設定に `ESC ] 11 ; <色> BEL`、リセットに `ESC ] 111 BEL` を
ターミナルへ書き込みます。記憶した色は
`${XDG_CONFIG_HOME:-~/.config}/gbg/paths` に `<ディレクトリ><TAB><#hex>` の
行として保存されます。

## 必要環境

- Node.js >= 18
- OSC 11 に対応したターミナル（Ghostty, iTerm2 など大半のモダンターミナル）
