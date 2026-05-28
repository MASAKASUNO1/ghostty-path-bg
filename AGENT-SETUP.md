# Agent Setup Guide

Use this guide when an agent is asked to install, modify, verify, or package this
project on a user's machine.

## Purpose

`ghostty-path-bg` is a zsh integration for Ghostty. It changes the terminal
background color when the current working directory changes.

It does not require a Ghostty fork. It uses the standard OSC 11 escape sequence:

```sh
printf '\033]11;#101820\007'
```

## Files

- `ghostty-path-bg.zsh`: runtime zsh integration.
- `install.sh`: idempotent installer for `~/.config/zsh/ghostty-path-bg.zsh`.
- `README.md`: user-facing docs.
- `AGENT-SETUP.md`: this guide.

## Install Flow

Run:

```sh
./install.sh
source ~/.zshrc
```

The installer:

1. Copies `ghostty-path-bg.zsh` to `~/.config/zsh/ghostty-path-bg.zsh`.
2. Ensures `~/.zshrc` exists.
3. Appends one source line if `ghostty-path-bg.zsh` is not already referenced.

Do not overwrite the user's `.zshrc`. It may contain secrets or unrelated custom
configuration.

## Verification

Run syntax checks:

```sh
zsh -n ghostty-path-bg.zsh
sh -n install.sh
```

Run behavior checks without emitting Ghostty escape sequences:

```sh
TERM_PROGRAM=notghostty zsh -fc 'source ./ghostty-path-bg.zsh; _ghostty_path_bg_key "$HOME/playground/example/src"; _ghostty_path_bg_color "$HOME/playground/example/src"'
```

Expected behavior:

- `~/playground/example` and `~/playground/example/src` use the same key:
  `example`.
- Git repositories outside `~/playground` use the Git root directory name.
- Non-Ghostty terminals do not receive OSC 11 sequences.
- Sourcing the script repeatedly should not duplicate `chpwd` hooks.

Hook duplication check:

```sh
TERM_PROGRAM=notghostty zsh -fc 'source ./ghostty-path-bg.zsh; source ./ghostty-path-bg.zsh; print -rl ${(M)chpwd_functions:#set_ghostty_bg_for_pwd} | wc -l'
```

Expected output:

```text
1
```

## Modification Notes

- Keep `ghostty-path-bg.zsh` compatible with zsh.
- Keep `install.sh` POSIX sh compatible.
- Prefer adding colors to the palette over returning to generated HSL colors.
- Keep backgrounds dark enough for terminal text readability.
- Avoid reading or committing user dotfiles.

## Release Checklist

1. Run syntax checks.
2. Run behavior checks.
3. Confirm `git status --short` only shows intentional project files.
4. Commit changes.
5. Publish with GitHub CLI if requested:

```sh
gh repo create ghostty-path-bg --public --source=. --remote=origin --push
```
