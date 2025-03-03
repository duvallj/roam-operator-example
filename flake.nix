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
        # Just a simple development environment providing `caddy`, which is needed to run the reverse proxy + file server in one
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            caddy
          ];
        };
      }
    );
}
