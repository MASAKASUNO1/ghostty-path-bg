# Change Ghostty's background color based on the current project.
# The color is derived from the project directory name, so it stays stable.

_ghostty_path_bg_key() {
  local dir="${1:-$PWD}"

  if [[ "$dir" == "$HOME/playground/"* ]]; then
    local rest="${dir#$HOME/playground/}"
    print -r -- "${rest%%/*}"
    return
  fi

  local git_root
  git_root="$(git -C "$dir" rev-parse --show-toplevel 2>/dev/null)"
  if [[ -n "$git_root" ]]; then
    print -r -- "${git_root:t}"
    return
  fi

  print -r -- "${dir:t}"
}

_ghostty_path_bg_color() {
  local dir="${1:-$PWD}"
  local key hash index
  local -a colors

  key="$(_ghostty_path_bg_key "$dir")"
  [[ -n "$key" ]] || key="default"

  hash="$(printf '%s' "$key" | cksum | awk '{print $1}')"

  colors=(
    "#101820" "#121a24" "#141b2d" "#151829" "#171724" "#1a1624"
    "#1d1522" "#21151f" "#24161b" "#271817" "#291b14" "#292014"
    "#252414" "#202714" "#1a2a18" "#142b1d" "#102b24" "#0f2a2a"
    "#102630" "#122336" "#172039" "#1d1d39" "#241a37" "#2a1733"
    "#30172c" "#341925" "#351d1f" "#34231a" "#302817" "#292c17"
    "#213018" "#18321d" "#123326" "#103231" "#10303a" "#142b40"
    "#1b2744" "#242344" "#2d2041" "#351d3a" "#3a1e31" "#3d2228"
    "#3d2921" "#39311d" "#31371d" "#273b20" "#1d3e29" "#163d35"
    "#153a40" "#183645" "#20314a" "#2a2c4a" "#352747" "#3f2440"
    "#462638" "#492b30" "#493329" "#443b25" "#3b4225" "#304729"
    "#254a33" "#1d493f" "#1c4649" "#20414f" "#293b53" "#343653"
    "#403050" "#4a2d48" "#512f3e" "#533534" "#513e2d" "#4a472b"
    "#414e2d" "#355333" "#2a553f" "#23534c" "#235058" "#284a5f"
  )

  index=$(( hash % ${#colors[@]} + 1 ))
  print -r -- "${colors[$index]}"
}

set_ghostty_bg_for_pwd() {
  [[ "$TERM_PROGRAM" == "ghostty" ]] || return 0

  local color
  color="$(_ghostty_path_bg_color "$PWD")"
  printf '\033]11;%s\007' "$color"
}

ghostty_bg_reset() {
  [[ "$TERM_PROGRAM" == "ghostty" ]] || return 0
  printf '\033]111\007'
}

autoload -Uz add-zsh-hook
add-zsh-hook -d chpwd set_ghostty_bg_for_pwd 2>/dev/null
add-zsh-hook chpwd set_ghostty_bg_for_pwd
set_ghostty_bg_for_pwd
