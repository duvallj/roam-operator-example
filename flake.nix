# This file is used to provide a development environment with Caddy & Python
# 3.12 installed for Nix users. If you don't know what Nix is, don't worry
# about it.
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            caddy

            python312
            # For automatic formatting
            python312Packages.autopep8
          ];
        };
      }
    );
}
